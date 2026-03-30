from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.http import JsonResponse

from .models import Beverage, Cleaner, Party, OpenedBottle
from .serializers import UserSerializer, BeverageSerializer, CleanerSerializer, PartySerializer, OpenedBottleSerializer

User = get_user_model()

# Roles con acceso a cada recurso
CAN_EDIT_BEVERAGES  = ('admin', 'beverage_manager')
CAN_VIEW_BEVERAGES  = ('admin', 'beverage_manager', 'bartender')
CAN_EDIT_CLEANERS   = ('admin', 'chef')
CAN_VIEW_CLEANERS   = ('admin', 'chef')
CAN_USE_PARTIES     = ('admin', 'beverage_manager', 'bartender')


def role(request):
    return getattr(request.user, 'role', '')


@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    return Response({"status": "ok"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
    })


class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# --- Beverages ---
class BeverageApi(APIView):
    authentication_classes = [TokenAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if role(request) not in CAN_VIEW_BEVERAGES:
            return Response({"detail": "No permission."}, status=403)
        return Response(BeverageSerializer(Beverage.objects.all(), many=True).data)

    def post(self, request):
        if role(request) not in CAN_EDIT_BEVERAGES:
            return Response({"detail": "No permission."}, status=403)
        serializer = BeverageSerializer(data=request.data)
        if serializer.is_valid():
            beverage = serializer.save()
            alert = None
            if beverage.quantity < beverage.min_stock:
                alert = f"Warning: Low stock for {beverage.name}"
            response = {"message": "Beverage created", "beverage": BeverageSerializer(beverage).data}
            if alert:
                response["alert"] = alert
            return Response(response, status=201)
        return Response(serializer.errors, status=400)


class BeverageDetailApi(APIView):
    authentication_classes = [TokenAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, id):
        return get_object_or_404(Beverage, id=id)

    def get(self, request, id):
        if role(request) not in CAN_VIEW_BEVERAGES:
            return Response({"detail": "No permission."}, status=403)
        return Response(BeverageSerializer(self.get_object(id)).data)

    def put(self, request, id):
        if role(request) not in CAN_EDIT_BEVERAGES:
            return Response({"detail": "No permission."}, status=403)
        beverage = self.get_object(id)
        serializer = BeverageSerializer(beverage, data=request.data, partial=True)
        if serializer.is_valid():
            beverage = serializer.save()
            alert = None
            if beverage.quantity < beverage.min_stock:
                alert = f"Warning: Low stock for {beverage.name}"
            response = {"message": "Beverage updated", "beverage": BeverageSerializer(beverage).data}
            if alert:
                response["alert"] = alert
            return Response(response)
        return Response(serializer.errors, status=400)

    def delete(self, request, id):
        if role(request) not in CAN_EDIT_BEVERAGES:
            return Response({"detail": "No permission."}, status=403)
        self.get_object(id).delete()
        return Response({"message": "Beverage deleted"}, status=204)


# --- Cleaners ---
class CleanerApi(APIView):
    authentication_classes = [TokenAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if role(request) not in CAN_VIEW_CLEANERS:
            return Response({"detail": "No permission."}, status=403)
        return Response(CleanerSerializer(Cleaner.objects.all(), many=True).data)

    def post(self, request):
        if role(request) not in CAN_EDIT_CLEANERS:
            return Response({"detail": "No permission."}, status=403)
        serializer = CleanerSerializer(data=request.data)
        if serializer.is_valid():
            cleaner = serializer.save()
            alert = None
            if cleaner.quantity < cleaner.min_stock:
                alert = f"Warning: Low stock for {cleaner.name}"
            response = {"message": "Cleaner created", "cleaner": CleanerSerializer(cleaner).data}
            if alert:
                response["alert"] = alert
            return Response(response, status=201)
        return Response(serializer.errors, status=400)


class CleanerDetailApi(APIView):
    authentication_classes = [TokenAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, id):
        return get_object_or_404(Cleaner, id=id)

    def get(self, request, id):
        if role(request) not in CAN_VIEW_CLEANERS:
            return Response({"detail": "No permission."}, status=403)
        return Response(CleanerSerializer(self.get_object(id)).data)

    def put(self, request, id):
        if role(request) not in CAN_EDIT_CLEANERS:
            return Response({"detail": "No permission."}, status=403)
        cleaner = self.get_object(id)
        serializer = CleanerSerializer(cleaner, data=request.data, partial=True)
        if serializer.is_valid():
            cleaner = serializer.save()
            alert = None
            if cleaner.quantity < cleaner.min_stock:
                alert = f"Warning: Low stock for {cleaner.name}"
            response = {"message": "Cleaner updated", "cleaner": CleanerSerializer(cleaner).data}
            if alert:
                response["alert"] = alert
            return Response(response)
        return Response(serializer.errors, status=400)

    def delete(self, request, id):
        if role(request) not in CAN_EDIT_CLEANERS:
            return Response({"detail": "No permission."}, status=403)
        self.get_object(id).delete()
        return Response({"message": "Cleaner deleted"}, status=204)


# --- Parties ---
class PartyApi(APIView):
    authentication_classes = [TokenAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if role(request) not in CAN_USE_PARTIES:
            return Response({"detail": "No permission."}, status=403)
        parties = Party.objects.prefetch_related('opened_bottles').all()
        return Response(PartySerializer(parties, many=True).data)

    def post(self, request):
        if role(request) not in CAN_USE_PARTIES:
            return Response({"detail": "No permission."}, status=403)
        serializer = PartySerializer(data=request.data)
        if serializer.is_valid():
            party = serializer.save()
            return Response(PartySerializer(party).data, status=201)
        return Response(serializer.errors, status=400)


class PartyDetailApi(APIView):
    authentication_classes = [TokenAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        if role(request) not in CAN_USE_PARTIES:
            return Response({"detail": "No permission."}, status=403)
        return Response(PartySerializer(get_object_or_404(Party, id=id)).data)

    def delete(self, request, id):
        if role(request) not in CAN_USE_PARTIES:
            return Response({"detail": "No permission."}, status=403)
        get_object_or_404(Party, id=id).delete()
        return Response({"message": "Party deleted"}, status=204)


# --- Opened Bottles ---
class BottleApi(APIView):
    authentication_classes = [TokenAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, party_id):
        if role(request) not in CAN_USE_PARTIES:
            return Response({"detail": "No permission."}, status=403)
        party = get_object_or_404(Party, id=party_id)
        serializer = OpenedBottleSerializer(data=request.data)
        if serializer.is_valid():
            bottle = serializer.save(party=party)
            # Descontar 1 del stock del beverage vinculado
            if bottle.beverage:
                bottle.beverage.quantity = max(0, bottle.beverage.quantity - 1)
                bottle.beverage.save()
            return Response(OpenedBottleSerializer(bottle).data, status=201)
        return Response(serializer.errors, status=400)


class BottleDetailApi(APIView):
    authentication_classes = [TokenAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, party_id, bottle_id):
        if role(request) not in CAN_USE_PARTIES:
            return Response({"detail": "No permission."}, status=403)
        bottle = get_object_or_404(OpenedBottle, id=bottle_id, party_id=party_id)
        bottle.delete()
        return Response({"message": "Bottle removed"}, status=204)