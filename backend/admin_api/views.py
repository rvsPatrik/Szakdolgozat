from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db import connection

class AdminSQLView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        mode = (request.data.get('mode') or 'read').lower()
        sql = (request.data.get('query') or '').strip()
        if not sql:
            return Response({'detail': 'Empty query'}, status=status.HTTP_400_BAD_REQUEST)

        low = sql.lower()

        forbidden = ['drop ', 'alter ', 'create ', 'truncate ', 'grant ', 'revoke ',
                     '--', '/*', 'exec ', 'execute ']
        for token in forbidden:
            if token in low:
                return Response({'detail': f'Forbidden token: {token.strip()}'}, status=status.HTTP_400_BAD_REQUEST)

        if ';' in sql:
            return Response({'detail': 'Multiple statements (;) are not allowed'}, status=status.HTTP_400_BAD_REQUEST)

        if mode == 'read':
            if not low.startswith('select'):
                return Response({'detail': 'Read mode accepts SELECT only'}, status=status.HTTP_400_BAD_REQUEST)
        elif mode == 'write':
            if not (user.is_superuser or user.is_staff):
                return Response({'detail': 'Write mode requires staff/superuser'}, status=status.HTTP_403_FORBIDDEN)
            allowed_starts = ('select', 'insert', 'update', 'delete', 'replace')
            if not low.startswith(allowed_starts):
                return Response({'detail': 'Write mode accepts only SELECT/INSERT/UPDATE/DELETE/REPLACE'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'detail': 'Invalid mode'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with connection.cursor() as cursor:
                cursor.execute(sql)
                if cursor.description:  # SELECT
                    cols = [c[0] for c in cursor.description]
                    rows = cursor.fetchall()
                    return Response({'columns': cols, 'rows': rows})
                else:
                    return Response({'rows_affected': cursor.rowcount})
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)