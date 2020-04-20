addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

class ElementHandler {

    constructor(url_index){
        this.url_index = url_index;
    }

  element(element) {
    if(element.tagName == 'title'){
        element.setInnerContent('Nikita Bairagi')
    }

    if(element.tagName == 'h1'){
        element.setInnerContent('Nikita Bairagi')
    }

    if(this.url_index == 0 && element.tagName == 'a'){
        element.setInnerContent('Visit my Website')
        element.setAttribute('href','https://nikitabairagi.com/')
    }

    if(this.url_index == 1 && element.tagName == 'a'){
        element.setInnerContent('Connect on LinkedIn')
        element.setAttribute('href','https://www.linkedin.com/in/nikitabairagi/')
    }

  }
}


async function handleRequest(request) {
  const base_url = 'https://cfw-takehome.developers.workers.dev/api/variants'

  try{
     let base_url_res =  await fetch(base_url)
     let res_json =  await base_url_res.json()
     let url_index = null
     let cookie = request.headers.get('cookie')
     if(cookie != null) {
         let tokens = cookie.split(';');
         tokens.forEach(token => {
           let name = token.split('=')[0].trim();
           if (name == 'url_index') {
             url_index = token.split('=')[1];
           }
         })
     }
     if(url_index == null) {
        // if un-cookied then choose random url
        url_index = Math.floor(Math.random() * res_json.variants.length)
     }
    // response from one of the url
    let random_res = await fetch(res_json.variants[url_index])
    html = await random_res.text();
      response = new Response(html, {
        headers : {'content-type': 'text/html',
        'set-cookie': 'url_index='+url_index+';'},
    });
    return new HTMLRewriter().on('*', new ElementHandler(url_index)).transform(response);

  }catch(e){
      return new Response(JSON.stringify({error: e.message}), {status: 500})
  }
}
