from flask import (Blueprint, render_template)

public = Blueprint('public',__name__)

@public.route('/')
def inicio():
    return render_template('index.html')