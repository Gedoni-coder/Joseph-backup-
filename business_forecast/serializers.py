from rest_framework import serializers
from .models import BusinessMetric

class BusinessMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessMetric
        fields = '__all__'

