from rest_framework import serializers


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        # Get the fields to include dynamically
        included_fields = kwargs.pop('included_fields', None)

        # Call the parent constructor
        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

        # If included_fields is provided, filter the fields
        if included_fields:
            self.fields = {field: self.fields[field] for field in included_fields}
