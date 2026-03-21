from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import BusinessMetric
from .serializers import BusinessMetricSerializer

class BusinessMetricListView(generics.ListAPIView):
    queryset = BusinessMetric.objects.all()
    serializer_class = BusinessMetricSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

