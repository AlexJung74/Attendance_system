from django.core.management.base import BaseCommand
from django.db import connection


class Command(BaseCommand):
    help = 'Delete all tables in the database by resolving foreign key dependencies'

    def handle(self, *args, **kwargs):
        with connection.cursor() as cursor:
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = cursor.fetchall()
            # 참조 무결성 문제를 피하기 위해 외래 키가 없는 테이블부터 삭제
            for table_name in reversed([table[0] for table in tables]):
                if table_name == 'sqlite_sequence':
                    # 시스템 테이블은 건너뜀
                    self.stdout.write(f'Skipping system table {table_name}')
                    continue
                self.stdout.write(f'Deleting table {table_name}')
                try:
                    cursor.execute(f"DROP TABLE IF EXISTS {table_name};")
                    self.stdout.write(self.style.SUCCESS(f'Successfully deleted {table_name}'))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Failed to delete {table_name}: {e}'))
