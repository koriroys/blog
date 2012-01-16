---
layout: default
title: Blog
---

{% for post in site.posts %}
  <span>{{ post.date | date_to_string }} &raquo; <a href="{{ post.url }}">{{ post.title }}</a> {{ post.content }}</span>
  <p>---</p>
{% endfor %}