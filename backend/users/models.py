from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):


    email = models.EmailField(max_length=254, blank=True)

    is_active = models.BooleanField(default=False)

    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('user', 'User'),
        ('viewer', 'Viewer'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    def __str__(self):
        return self.username