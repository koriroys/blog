---
layout: default
title: Blog
---

{% for post in site.posts %}
  <span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ post.url }}">{{ post.title }}</a> {{ post.content }}
  <p>---</p>
{% endfor %}