import azure.functions as func
from dotenv import load_dotenv

from src.zhp_accounts.hello_world import bp

app = func.FunctionApp()

load_dotenv()

app.register_functions(bp)
