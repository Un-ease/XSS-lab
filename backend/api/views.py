from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.db.models import Q
from core.models import Post, Comment
from .serializers import PostSerializer, CommentSerializer, UserSerializer

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(username=username, password=password)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'user': UserSerializer(user).data, 'token': token.key}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'user': UserSerializer(user).data, 'token': token.key})
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def logout_user(request):
    if request.user.is_authenticated:
        request.user.auth_token.delete()
    return Response({'message': 'Logged out successfully'})

@api_view(['GET'])
def current_user(request):
    if request.user.is_authenticated:
        return Response(UserSerializer(request.user).data)
    return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_comment(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    
    content = request.data.get('content')
    if not content:
         return Response({'error': 'Content required'}, status=status.HTTP_400_BAD_REQUEST)
         
    comment = Comment.objects.create(post=post, author=request.user, content=content)
    return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def search_content(request):
    query = request.query_params.get('q', '')
    
    posts = Post.objects.filter(Q(content__icontains=query)) if query else []
    
    return Response({
        'query': query,
        'results': PostSerializer(posts, many=True).data
    })
