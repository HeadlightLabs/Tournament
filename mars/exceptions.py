# This is here to handle any custom issues with the API
# I have not been able to get it to send me errors for 5 robots, so hard to tell what will happen with multiple robots
# Didn't want to do hundred and accidentally bring down the API

class ApiResultError(Exception):
    """
        Custom Error class for when errors occur in the API
    """
