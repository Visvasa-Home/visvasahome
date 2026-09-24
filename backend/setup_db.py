import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def setup():
    try:
        # Connect to the default postgres database
        root_conn = psycopg2.connect(
            dsn="postgresql://postgres:postgres@localhost:5432/postgres"
        )
        root_conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        root_cursor = root_conn.cursor()
        
        print("Connected to default postgres database.")
        
        # Create role
        try:
            root_cursor.execute("CREATE ROLE visvasahome WITH LOGIN PASSWORD 'visvasahome123'")
            print("Created role visvasahome.")
        except psycopg2.errors.DuplicateObject:
            print("Role visvasahome already exists.")
        except Exception as e:
            raise e
            
        dbs = [
            'visvasahome_auth',
            'visvasahome_user',
            'visvasahome_provider',
            'visvasahome_catalog',
            'visvasahome_booking',
            'visvasahome_payment',
            'visvasahome_rating',
            'visvasahome_outbox',
            'visvasahome_chat'
        ]
        
        for db in dbs:
            try:
                root_cursor.execute(f"CREATE DATABASE {db} OWNER visvasahome")
                print(f"Created database {db}.")
            except psycopg2.errors.DuplicateDatabase:
                print(f"Database {db} already exists.")
            except Exception as e:
                print(f"Error creating {db}: {e}")
                
        root_cursor.close()
        root_conn.close()
        
        # Connect to specific databases to create extensions
        postgis_dbs = ['visvasahome_user', 'visvasahome_provider']
        
        for db in postgis_dbs:
            try:
                db_conn = psycopg2.connect(
                    dsn=f"postgresql://postgres:postgres@localhost:5432/{db}"
                )
                db_conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
                db_cursor = db_conn.cursor()
                
                db_cursor.execute("CREATE EXTENSION IF NOT EXISTS postgis")
                print(f"Created PostGIS extension in {db}.")
                
                db_cursor.close()
                db_conn.close()
            except Exception as e:
                print(f"\nWARNING: Could not create PostGIS extension in {db}. Error: {e}")
                print("If you haven't installed PostGIS, open \"Application Stack Builder\" from your start menu, select your PostgreSQL installation, and install \"PostGIS\" under \"Spatial Extensions\".\n")
                
        print("\n✅ Database setup complete!")
        print("Backend is now ready to use the local PostgreSQL server.")
        
    except Exception as err:
        print(f"Failed to setup databases: {err}")

if __name__ == "__main__":
    setup()
