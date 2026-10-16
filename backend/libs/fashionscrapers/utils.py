import re


def contains_about_material_terms(details_list: list):
    # Convert all elements to lowercase
    details_list_lower_case = [detail.lower() for detail in details_list]

    # Define regex patterns
    percentage_pattern = r"%"
    sole_upper_pattern = r"\bsole\b.*\bupper\b|\bupper\b.*\bsole\b"
    materials_pattern = r"\b(leather|lining|textile|polyester|cotton|silk|wool|cashmere|viscose|nylon)\b"

    about_materials = []
    # Iterate over a copy of the indices, start from last to first
    for index in range(len(details_list)-1, -1, -1):
        detail = details_list_lower_case[index]
        if (re.search(percentage_pattern, detail) or
            re.search(sole_upper_pattern, detail) or
            re.search(materials_pattern, detail)):
            about_materials.append(details_list[index])
            # Remove the matched element from the original list
            del details_list[index]

    return about_materials  # No matches found
