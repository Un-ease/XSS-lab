import random
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import Post, Comment

class Command(BaseCommand):
    help = 'Seeds the database with initial users, posts, and comments'

    def handle(self, *args, **kwargs):
        self.stdout.write('Deleting existing data...')
        Comment.objects.all().delete()
        Post.objects.all().delete()
        User.objects.all().delete()

        self.stdout.write('Creating demo users...')
        user1 = User.objects.create_user(username='admin', password='password123', email='admin@xsslab.internal')
        user2 = User.objects.create_user(username='alice', password='password123', email='alice@xsslab.internal')
        user3 = User.objects.create_user(username='bob', password='password123', email='bob@xsslab.internal')

        self.stdout.write('Creating demo posts...')
        post1 = Post.objects.create(author=user1, content='Welcome to the new platform! Glad to have you all here.')
        post2 = Post.objects.create(author=user2, content='Just joined! Can anyone help me find the search bar? I want to look for specific topics.')
        post3 = Post.objects.create(author=user3, content='Loving the brutalist design of this site. Very modern.')

        self.stdout.write('Creating demo comments...')
        Comment.objects.create(post=post1, author=user2, content='Thanks admin! Excited to be here.')
        Comment.objects.create(post=post2, author=user1, content='It should be in the top navigation bar.')
        Comment.objects.create(post=post3, author=user1, content='Glad you like it!')

        self.stdout.write(self.style.SUCCESS('Successfully seeded the database'))
