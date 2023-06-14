from django.shortcuts import render
from django.shortcuts import redirect
from . import util
from markdown2 import Markdown 
from . import util
import random


def markdowner(title):
    entry = util.get_entry(title)
    markdowned = Markdown()
    if entry == None:
        return None
    else:
        return markdowned.convert(entry)

def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def entry(request,title):
    markdowned = markdowner(title)
    if title in util.list_entries():
        return render(request,"encyclopedia/entries.html",{
            "title":title,
            "markdowned":markdowned
            })
    else:   
        return render(request,"encyclopedia/error.html",{
            "error":"Entry not found"
            })

def search(request):
    if request.method == "POST":
        entry = request.POST['q']
        markdowned = markdowner(entry)
        if markdowned is not None:
            return render(request,"encyclopedia/entries.html",{
                "title":entry,
                "markdowned":markdowned
            })
        else:
            entries = util.list_entries()
            substrings = []
            for i in entries:
                if entry.upper() in i.upper():
                    substrings.append(i)
            #return redirect("<str:title>")
            return render(request, "encyclopedia/search.html",{
                    "substrings":substrings
            }) 

def new_page(request):
    if request.method == 'POST':
        title = request.POST['title']
        content = request.POST['content']
        markdowner = Markdown()
        markdowned = markdowner.convert(content)
        submition = request.POST['submit']
        exists = util.get_entry(title)
        if exists is not None:
            return render(request, "encyclopedia/error.html",{
            "error":"Entry already exists"
                    })
        else:
            util.save_entry(title=title,content=content)
            return render(request, "encyclopedia/entries.html",{
            'title':title,
            'markdowned':markdowned
            })    
    else:
        return render(request, "encyclopedia/new_page.html")

def edit_page(request):
     if request.method == 'POST':
        title = request.POST['edit_title']
        content = util.get_entry(title)
        return render(request, "encyclopedia/edit_page.html",{
                "title":title,
                "content":content
                })

def save_edit(request):
    if request.method == 'POST':
        title = request.POST['edit_title']
        content = request.POST['edit_content']
        markdowner = Markdown()
        markdowned = markdowner.convert(content)
        util.save_entry(title=title,content=content)
        return render(request, "encyclopedia/entries.html",{
                "title":title,
                "markdowned":markdowned
                })

def random_page(request):
    entry = util.list_entries()
    random1 = random.choice(entry)
    markdowned = markdowner(random1)
    return render(request,"encyclopedia/entries.html",{
        'title':random1,
        'markdowned':markdowned
        })






    
    

    





