from rest_framework.views import exception_handler


def _flatten(value):
    if isinstance(value, list):
        for item in value:
            text = _flatten(item)
            if text:
                return text
        return None
    if isinstance(value, dict):
        for v in value.values():
            text = _flatten(v)
            if text:
                return text
        return None
    return str(value) if value is not None else None


def trivox_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return response

    data = response.data
    if isinstance(data, dict):
        if "detail" in data:
            data["detail"] = _flatten(data["detail"]) or "Request failed."
        else:
            response.data = {"detail": _flatten(data) or "Request failed.", "errors": data}
    elif isinstance(data, list):
        response.data = {"detail": _flatten(data) or "Request failed."}
    return response
