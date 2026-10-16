#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'azughai.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    # if the argument is runserver and the environment is not development
    # then load the model and processor
    if 'runserver' in sys.argv and os.environ.get('PRELOAD_EMBEDDER') == '1' and os.environ.get('RUN_MAIN') == 'true':
        from libs.fashp_embedder import default_embedder
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
