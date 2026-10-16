from .models import AgentVersion

try:
    AGENT_VERSION = AgentVersion.objects.filter(agent__name="AzughAI").first()
except:
    AGENT_VERSION = None