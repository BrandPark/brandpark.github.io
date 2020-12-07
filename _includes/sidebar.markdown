<div class="sidebar">
  <div class="menu-btn">
	<div class="line line--1"></div>
	<div class="line line--2"></div>
  </div>

  <div class="nav-links">
	
		{% for category in site.categories %}
			<!-- <a href="/category/{{ category | first }}" {% if category[0] == page.category %}class="active"{% endif %}> {{ category | first }} ({{ category | last | size }})</a> -->
			<a href="/category/{{ category | first }}" {% if category[0] == page.category %}class="active link" {% else %} class="link"{% endif %}> {{ category | first }} ({{ category | last | size }})</a>
		{% endfor %}
		
  </div>
</div>