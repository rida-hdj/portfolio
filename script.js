var list = document.getElementById('project-list');

fetch('https://api.github.com/users/rida-hdj/repos?per_page=100')
    .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        return res.json();
    })
    .then(function (repos) {
        var filtered = repos.filter(function (r) {
            return !r.fork && !r.archived;
        });

        filtered.sort(function (a, b) {
            var scoreA = a.stargazers_count * 2 + a.forks_count;
            var scoreB = b.stargazers_count * 2 + b.forks_count;
            return scoreB - scoreA;
        });

        var top = filtered.slice(0, 6);

        if (top.length === 0) {
            list.innerHTML = '<li class="project-loading">No repositories found.</li>';
            return;
        }

        list.innerHTML = '';

        top.forEach(function (repo) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = repo.html_url;
            a.target = '_blank';

            var name = document.createElement('div');
            name.className = 'project-name';
            name.textContent = repo.name;
            a.appendChild(name);

            var desc = document.createElement('div');
            desc.className = 'project-desc';
            desc.textContent = repo.description || '';
            a.appendChild(desc);

            var meta = document.createElement('div');
            meta.className = 'project-meta';

            var lang = document.createElement('span');
            lang.textContent = repo.language || '';
            meta.appendChild(lang);

            var stars = document.createElement('span');
            stars.innerHTML = '&#9733; ' + repo.stargazers_count;
            meta.appendChild(stars);

            a.appendChild(meta);
            li.appendChild(a);
            list.appendChild(li);
        });
    })
    .catch(function () {
        list.innerHTML = '<li class="project-error">Failed to load repositories.</li>';
    });
