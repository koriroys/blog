---
layout: post
---

Prerequisite:

You've completed my [Error Driven Development](http://koriroys.com/2012/08/15/Error-Driven-Development-And-Authenticating-With-Github/) post.

Ok, so your github auth is working in development and test, becuase we
turned test mode on for development and test. Great. Now let's say you
want to see if you can authenticate for real with Github. Well, let's get
to it.
    
First let's turn off Omniauth test mode in development. Remember that line
you added to ```config/environments/development.rb```? No, well, here it
is to refresh your memomry:

{% highlight ruby %}
OmniAuth.config.test_mode = true
{% endhighlight %}

Yeah, delete that line, save the file, and restart your rails server (if
you have a rails server running right now).

Now, navigate to localhost:3000 in your browser, and click on the 'Login
with Github' link. It should give you a 404 error.

Here's how we fix this. First, go to your github account and register a
new application. Github.com -> Account Settings (upper right) ->
Applications. Click on Register New Application. Fill in the form as
follows:

Application Name: github_auth_development

Main URL: http://localhost:3000

Callback URL: http://localhost:3000/auth/github/callback

then click Register Application

now on the next page you should see:

Client ID: 'xxxxxx'

Client Secret: 'yyyyyy'

open ```config/initializers/omniauth.rb``` and take a look at it. You
should see this:

{% highlight ruby %}
Rails.application.config.middleware.use OmniAuth::Builder do
  provider :github, ENV['GITHUB_KEY'], ENV['GITHUB_SECRET']
end
{% endhighlight %}

Now we are going to tell our application about the Client ID and Client
Secret for the application we just made.

Open up ```.gitignore``` and add the following line to the end:

    /config/initializers/_env.rb

We want to ignore this file because we don't want to save our secret
keys into source control for just anyone to see.

Next, create that file:
    
    touch config/initializers/_env.rb

Now, edit ```config/initializers/_env.rb``` to look like this:

{% highlight ruby %}
ENV['GITHUB_KEY'] = 'xxxxxx'
ENV['GITHUB_SECRET'] = 'yyyyyy'
{% endhighlight %}

Where 'xxxxxx' and 'yyyyyy' are the Client ID and Client Secret from
your github application you just created.

You should now be ready to rock and roll. Restart your rails server
(because we just edited a bunch of initializers, and they only get
loaded when you start the server), and you should be able to login with
Github.


P.S. If you want to revert back to not actually authenticating with
Github in development mode, just edit ```config/environments/development.rb```
to have:

{% highlight ruby %}
OmniAuth.config.test_mode = true
{% endhighlight %}

at the bottom. Restart your server, and you're good to go.
