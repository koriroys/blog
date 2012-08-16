---
layout: post
---

- [The Setup](#the_setup)
- [Test first](#failing)
- [Github Authentication](#gh_auth)
- [Logging Out](#logout)

<div id='the_setup'></div>
## [The Setup](#the_setup)



Prerequisites:

    Rails 3.2.7
    Ruby 1.9.2
    
Ok, first step, we'll make a new Rails project:

    rails new github_auth static_pages --skip-bundle -T
    cd github_auth
    rm public/index.html
    rm app/assets/images/rails.png
    rm README.rdoc
    touch Readme.md
    echo "Basic readme to be filled in later" > Readme.md
    
Once all that is done, open up ```Gemfile``` and make it look like this:

{% highlight ruby %}
source 'https://rubygems.org'

gem 'rails', '3.2.7'
gem 'jquery-rails'
gem 'omniauth-github'

group :development, :test do
  gem 'sqlite3'
  gem 'rspec-rails'
  gem 'capybara'
end

group :production do
  gem 'pg'
end

group :assets do
  gem 'sass-rails',   '~> 3.2.3'
  gem 'coffee-rails', '~> 3.2.1'
  gem 'uglifier', '>= 1.0.3'
end
{% endhighlight %}

Now run 

    bundle install

and

    rails generate rspec:install

and finally:

    git init
    git add .
    git commit -m "I'M PAR TY ING"

<div id='failing'></div>
## The Failing Test

Ok, let's do this right. Let's write a failing test to guide our development.

    mkdir spec/requests
    touch spec/requests/github_auth_spec.rb

In ```spec/requests/github_auth_spec.rb```:
{% highlight ruby %}
require 'spec_helper'

describe "logging in with github" do
  it "should be successful" do
    visit root_path
    click_link 'Login with Github'
    expect(page).to have_content 'Logged in Successfully'
  end
end
{% endhighlight %}

Run the test:

    bundle exec rspec spec
    
and you should see that it fails. Now all that remains is to get this test passing...

The first failure is:

    undefined local variable or method `root_path'

which we fix by adding a root_path in ```config/routes.rb```, like so:

{% highlight ruby %}
GithubAuth::Application.routes.draw do
  root to: 'static_pages#index'
end
{% endhighlight %}

Now our test should give a new error:

    ActionController::RoutingError:
           uninitialized constant StaticPagesController

which we fix by creating the file ```app/controllers/static_pages_controller.rb``` and putting this in it:

{% highlight ruby %}
class StaticPagesController < ApplicationController; end
{% endhighlight %}

which gets us past our current failure. Our new error is:

    The action 'index' could not be found for StaticPagesController

Let's fix that shall we? Update ```app/controllers/static_pages_controller.rb``` so it looks like this:

{% highlight ruby %}
class StaticPagesController < ApplicationController
    def index
        
    end
end
{% endhighlight %}

See that we get a new error:

    Missing template static_pages/index

To fix this, we need to create the template it is looking for. Create the folder ```app/views/static_pages``` and add the file ```app/views/static_pages/index.html.erb``` to your project.

Finally! Our first interesting error:

    Capybara::ElementNotFound:
           no link with title, id or text 'Login with Github' found

Let's get rid of it. How? Well, it's looking for a link called 'Login with Github', so let's make one. In ```app/views/static_pages/index.html.erb``` add this line:

{% highlight ruby %}
<%= link_to 'Login with Github' %>
{% endhighlight %}

Now at this point, if you re-run the tests, the last failure is: 

    Failure/Error: expect(page).to have_content 'Logged in Successfully'
           expected there to be content "Logged in Successfully" in "GithubAuth\n\nLogin with Github\n\n\n"
           
We could cheat here, and just add the content ```Logged in Successfully``` to the page and be done with this spec, but that doesn't actually get us logged in with Github. So let's login with Github

<div id='gh_auth'></div>

## [The Authentication With Github](#gh_auth)

Authentication using the ```omniauth-github``` gem we included in our Gemfile is actually pretty easy, even if the steps on how to do it are all spread around the web. Here, I provide a walkthrough to save you some Googling, and as a reference for myself when I inevitably forget what the hell I did yesterday.

Change ```app/views/static_pages/index.html.erb``` to look like this:

{% highlight ruby %}
<%= link_to 'Login with Github', github_auth_path %>
{% endhighlight %}

You will get this error:

    ActionView::Template::Error:
           undefined local variable or method `github_auth_path'

Open up ```config/routes.rb``` and add:
{% highlight ruby %}
get '/auth/github', as: :github_auth
{% endhighlight %}

and you should get a new error:

    ActionController::RoutingError:
           uninitialized constant AuthController

We fix this by creating ```config/initializers/omniauth.rb``` and adding the following to it:
{% highlight ruby %}
Rails.application.config.middleware.use OmniAuth::Builder do
  provider :github, ENV['GITHUB_KEY'], ENV['GITHUB_SECRET']
end
{% endhighlight %}

Run your tests again, and you should get a new error:

    ActionController::RoutingError:
           No route matches [GET] "/login/oauth/authorize"

[Whoops!](http://www.youtube.com/watch?v=Gzj723LkRJY&t=0m26s) Guess we forgot to turn on test mode for omni-auth. Let's do that now. Add the following line to ```config/environments/development.rb``` and ```config/environments/test.rb```:
{% highlight ruby %}
OmniAuth.config.test_mode = true
{% endhighlight %}

Now we should see a new error:

    ActionController::RoutingError:
           No route matches [GET] "/auth/github/callback"

Ok, fine. Be that way. But not for long! Turns out we just forgot to add the other piece needed for Omniauth to work: the callback url it should go to after the external authorization is finished. Duh! How could we be so forgetful?

Anyways, let's fix our error. Add this line to your routes file:

{% highlight ruby %}
match '/auth/github/callback' => 'sessions#create'
{% endhighlight %}

Hooray! We have a callback url now. But wait a minute. What's that? A new error you say?

    ActionController::RoutingError:
           uninitialized constant SessionsController

[Whoops!](http://www.youtube.com/watch?v=Gzj723LkRJY&t=1m20s) We know how to fix this kind of error now. Add the file ```app/controllers/sessions_controller.rb``` to your project, and the following code in the new file:

{% highlight ruby %}
class SessionsController < ApplicationController; end
{% endhighlight %}

Great! Now we have a new error:

    AbstractController::ActionNotFound:
           The action 'create' could not be found for SessionsController

We've fixed one like this before, so try and do it yourself before looking below.

Edit ```app/controllers/sessions_controller.rb``` to look like this:

{% highlight ruby %}
class SessionsController < ApplicationController
  def create

  end
end
{% endhighlight %}

Getting closer...but now we have a new problem. Create doesn't have a template to render:

    ActionView::MissingTemplate:
           Missing template sessions/create

Lucky for us we don't actually want create to render a template, so we just need to override the Rails default and set up create so that it redirects. Before we do that though, let's give our session something to play with, in this case, the response from authorizing with github. Add the following to ```app/controllers/sessions_controller.rb```:

{% highlight ruby %}
class SessionsController < ApplicationController
  def create
    session[:github] = request.env['omniauth.auth']
    redirect_to root_path
  end
end
{% endhighlight %}

So close now! A new error approaches:

    Failure/Error: expect(page).to have_content 'Logged in Successfully'
           expected there to be content "Logged in Successfully" in "GithubAuth\n\nLogin with Github\n\n\n"

Our test is finally through the click_link line, and has continued on to the actual expectation, which failed as expected. Let's make it pass. Edit ```app/controllers/sessions_controller.rb``` to look like this:

{% highlight ruby %}
class SessionsController < ApplicationController
  def create
    session[:github] = request.env['omniauth.auth']
    flash[:notice] = 'Logged in Successfully'
    redirect_to root_path
  end
end
{% endhighlight %}

BOOM! Our test passes!

Unfortunately, we can't logout. This seems like a bit of an oversight on our part. Let's fix that, shall we?

<div id='logout'></div>

## [The Log Out](#logout)

Test first, as always. Open up ```spec/requests/github_auth_spec.rb``` and add the following test:

{% highlight ruby %}
describe "logging out" do
  it "should be successful" do
    visit root_path
    click_link 'Login with Github'
    click_link 'Logout'
    expect(page).to have_content 'Logged out Successfully'
  end
end
{% endhighlight %}

Running the tests we see that Rspec is not very happy:

    Capybara::ElementNotFound:
           no link with title, id or text 'Logout' found

How do we appease the Rspec? Well, it would make sense to have a 'Logout' link when we are logged in, wouldn't it? Let's add one. Add the following to ```app/view/static_pages/index.html.erb```:

{% highlight ruby %}
<%= link_to 'Logout' %>
{% endhighlight %}

We get the following error:

    Failure/Error: expect(page).to have_content 'Logged out Successfully'
           expected there to be content "Logged out Successfully" in "GithubAuth\n\nLogin with Github\nLogout\n\n\n"

We can fix this trivially, but let's have a little more fun. Edit the line we just added to ```app/view/static_pages/index.html.erb``` to this:

{% highlight ruby %}
<%= link_to 'Logout', logout_path %>
{% endhighlight %}

Uh oh! We regressed, and now our first test is failing with:

    ActionView::Template::Error:
           undefined local variable or method `logout_path'

Edit ```config/routes.rb``` to have this code:

{% highlight ruby %}
get '/logout' => 'sessions#destroy', as: :logout
{% endhighlight %}

We know how to fix this error:

    AbstractController::ActionNotFound:
           The action 'destroy' could not be found for SessionsController

Open up ```app/controllers/sessions_controller.rb``` and define the destroy method:

{% highlight ruby %}
def destroy
  reset_session
end
{% endhighlight %}

Which leads us to:

    ActionView::MissingTemplate:
           Missing template sessions/destroy

We don't actually care about rendering a template, so let's just redirect. And while we're at it we will reset the session and flash a message as well:

{% highlight ruby %}
def destroy
  reset_session
  flash[:notice] = "Logged out Successfully"
  redirect_to root_path
end
{% endhighlight %}

And with that, we're back to green!

Now it doesn't make much sense to show a login AND logout link at the same time, but I will leave that as an exercise to the reader.

P.S. This isn't really TDD, it's more EDD, or Error Driven Development, with just enough of a smoke test to keep me honest. I use the errors as a check list to keep me on task, since I tend to have trouble focusing for long stretches of time. Feedback welcome!

P.S.S. I left out the ENV variable assignment for the github key and secret. Pshh, you only need those if you plan to deploy your app to a production environment, and who wants to do that???

P.S.S.S If you want to see what the github session info looks like, add this to ```app/views/static_pages/index.html.erb```:

{% highlight ruby %}
<p>
  <%= session[:github].as_json if session[:github] %>
</p>
{% endhighlight %}

Enjoy!

[top](#top)