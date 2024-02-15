import scrapy

class Biki(scrapy.Spider):
    name = "biki"

    def start_requests(self):
        url = getattr(self, 'url', None)
        css_selector = getattr(self, 'css_selector', None)
        params = getattr(self, 'params', None)
        generic_names = getattr(self, 'generic_names', None)
        follow_next = getattr(self, 'follow_next', 'default_next_selector')  # Set a default value

        HEADERS = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "identity",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Cache-Control": "max-age=0",
            "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.196 Mobile Safari/537.36",
        }

        self.visited_pages = set()

        if url and css_selector and params:
            params_list = params.split(',')
            generic_names_list = generic_names.split(',')
            yield scrapy.Request(
                url=url,
                callback=self.parse,
                headers=HEADERS,
                cb_kwargs={
                    'css_selector': css_selector,
                    'params': params_list,
                    'generic_names': generic_names_list,
                    'follow_next': follow_next,
                })

    def parse(self, response, css_selector, params, generic_names, follow_next):
        labels = dict(zip(params, generic_names))

        for element in response.css(css_selector):
            data = {}
            for param in params:
                label = labels.get(param, param)
                data[label] = element.css(param).getall()

            yield data

        if response.url not in self.visited_pages:
            self.visited_pages.add(response.url)

            next_page = response.css(follow_next).get()
            if next_page is not None:
                next_page = response.urljoin(next_page)
                yield scrapy.Request(
                    next_page,
                    callback=self.parse,
                    cb_kwargs={
                        'css_selector': css_selector,
                        'params': params,
                        'generic_names': generic_names,
                        'follow_next': follow_next,
                    })
