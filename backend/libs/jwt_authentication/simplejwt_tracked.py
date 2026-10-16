from rest_framework_simplejwt.tokens import RefreshToken, AccessToken, Token
# from datetime import datetime
# from user.models import TokensActivity
# from AirMediav0 import settings
# from django.core.cache import caches


class RefreshTokenTracked:
    """
    Custom refresh token handler that tracks and manages refresh/access tokens for users.

    This class wraps SimpleJWT's RefreshToken and adds tracking, blacklisting, and cache management.
    It is used to issue, refresh, and blacklist tokens, and to check token validity efficiently.
    """

    def __init__(self, refresh_token: str = None):
        """
        Initialize the RefreshTokenTracked instance.
        Attempts to parse the provided refresh token string. If invalid, self.token is set to None.
        """
        self.refresh_token_str = refresh_token
        try:
            # check if token is still valid, if not then function will still work; unauthentication will be handled later
            self.token = RefreshToken(refresh_token)
        except:
            self.token = None
        self.access_token = None
        self.access_token_str = None

    def for_user(self, user: object) -> tuple:
        """
        Generate and track a new refresh/access token pair for the given user.
        Stores the tokens in the cache and the TokensActivity model for auditing and blacklisting.
        Returns (refresh_token_str, access_token_str).
        """
        self.refresh_token = RefreshToken.for_user(user)
        self.refresh_token_str = str(self.refresh_token)
        self.token = RefreshToken(self.refresh_token_str)
        self.access_token = self.token.access_token
        self.access_token_str = str(self.access_token)
        # access_token_jti = self.get_jti(self.access_token_str)
        # caches['access_tokens'].set(access_token_jti, self.access_token_str)
        ### temporary deacrivate tracking scirpts ###

        # TokensActivity.objects.create(
        #     refresh_token=str(self.refresh_token),
        #     airmedia_user=user,
        #     last_access=datetime.now(),
        #     expires_at=datetime.now() +
        #     settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
        #     access_token=self.access_token_str
        # )

        ####
        return self.refresh_token_str, self.access_token_str

    def blacklist(self) -> None:
        """
        Blacklist the refresh token and its associated access token.
        Removes the access token from the cache and marks the TokensActivity record as blacklisted.
        """
        self.token.blacklist()
        ### temporary deacrivate tracking scirpts ###

        # token_object = TokensActivity.objects.get(
        #     refresh_token=self.refresh_token_str)
        # access_token_jti = self.get_jti(token_object.access_token)
        # caches['access_tokens'].delete(access_token_jti)
        # token_object.blacklisted = True
        # token_object.blacklisted_at = datetime.now()
        # token_object.last_access = datetime.now()
        # token_object.save()

        ####

    def refresh(self, keep_old_valid=True) -> tuple:
        """
        Refresh the access token using the stored refresh token.
        If keep_old_valid is True and the old access token is still valid, returns the old token.
        Otherwise, issues a new access token, updates the cache and TokensActivity record, and returns it.
        Returns (access_token_str, access_token_expiration).
        """
        self.token = RefreshToken(self.refresh_token_str)
        ### temporary deacrivate tracking scirpts ###

        # token_object = TokensActivity.objects.get(
        #     refresh_token=self.refresh_token_str)
        # old_access_token = token_object.access_token
        # if keep_old_valid == True and self.check_access_token(old_access_token) == True:
        #     self.access_token_str = old_access_token
        #     access_token_object = AccessToken(self.access_token_str)
        #     access_token_exp = access_token_object.payload['exp']
        #     return self.access_token_str, access_token_exp
        # else:

        ####
        self.access_token = self.token.access_token
        self.access_token_str = str(self.access_token)
        ### temporary deacrivate tracking scirpts ###

        # access_token_jti = self.get_jti(self.access_token_str)
        # caches['access_tokens'].set(
        #     access_token_jti, self.access_token_str)
        # old_access_token_jti = self.get_jti(old_access_token)
        # caches['access_tokens'].delete(old_access_token_jti)
        # token_object.last_access = datetime.now()
        # token_object.access_token = self.access_token_str
        # token_object.save()

        ####
        access_token_exp = self.token.access_token.get('exp')
        return self.access_token_str, access_token_exp

    def check_access_token(self, access_token: str) -> bool:
        """
        Check if the given access token is still valid (not blacklisted or expired).
        Returns True if valid, False otherwise.
        """
        # access_token_jti = self.get_jti(access_token)
        ### temporary deacrivate tracking scirpts ###

        # access_token_str = caches['access_tokens'].get(access_token_jti)
        # if token is none then return false
        if access_token is None:
            return False
        # check if access token is expired
        try:
            access_token_obj = AccessToken(access_token)
            access_token_obj.check_exp()
            return True
        except:
            return False
        ### temporary deacrivate tracking scirpts ###

        # if access_token_str is None:
        #     return False
        # else:
        #     return True

    def get_jti(self, access_token: str) -> str:
        """
        Extract the JWT ID (jti) from the given access token string.
        The jti is a unique identifier for the token, typically used for tracking or blacklisting purposes.
        Returns the jti if successful, None otherwise.
        """
        try:
            access_token_object = AccessToken(access_token)
            access_token_jti = access_token_object.payload['jti']
            return access_token_jti
        except:
            return None
