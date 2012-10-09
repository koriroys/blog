---
layout: post
---

If you've ever been frustrated in Ruby when you had to instantiate an object, start an iteration block, edit that object in the block, then return the object, then you are like me about 30 mins before I wrote this post. 

{% highlight ruby %}
def count(array)
  word_count = Hash.new(0)
  array.each { |word| word_count[word] += 1 }
  word_count
end
{% endhighlight %}

I just submitted the above as an answer to [Rubeque](http://rubeque.com/problems/counting-elements-in-array), which is an awesome site for improving your Ruby, especially if you look at other people's solutions once you submit your answer.

What I learned from looking at Josh Cheek's answer:

{% highlight ruby %}
array.each_with_object(Hash.new { |h, k| h[k] = 0 }) do |key, counted|
  counted[key] += 1
end
{% endhighlight %}

You don't have to do it the way I did! You can pass an object with your each block, and return that object when the each block terminates!
Sweet, now I can fix my answer based on what Josh's answer showed me:

{% highlight ruby %}
array.each.with_object(Hash.new(0)) {|word, word_count| word_count[word] += 1 }
{% endhighlight %}

Voilà! Guess it pays to spend some time with the standard library.
