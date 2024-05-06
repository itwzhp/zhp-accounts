import azure.functions as func

from src.zhp_accounts.hello_world import bp

app = func.FunctionApp()

app.register_functions(bp)
