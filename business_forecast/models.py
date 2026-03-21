from django.db import models

class BusinessMetric(models.Model):
    CATEGORY_CHOICES = [
        ('Financial', 'Financial'),
        ('Customer', 'Customer'),
        ('Sales & Marketing', 'Sales & Marketing'),
        ('Operational', 'Operational'),
        ('HR & Employee', 'HR & Employee'),
        ('Project & Product', 'Project & Product'),
        ('Innovation & Growth', 'Innovation & Growth'),
        ('Digital & IT', 'Digital & IT'),
    ]
    STATUS_CHOICES = [
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('excellent', 'Excellent'),
    ]
    
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    metric = models.CharField(max_length=100)
    current = models.CharField(max_length=50)  # '22.5%', '$2.8M'
    target = models.CharField(max_length=50)
    last_month = models.CharField(max_length=50, blank=True)
    trend = models.CharField(max_length=20, blank=True)
    change = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    
    class Meta:
        ordering = ['category', 'metric']
    
    def __str__(self):
        return f"{self.category}: {self.metric}"

