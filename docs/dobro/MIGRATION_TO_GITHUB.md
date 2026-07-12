# Перенос `dobro` в отдельный репозиторий на GitHub

Сейчас `dobro/` — подпапка монорепо `ClaudeProjects` без GitHub-remote (пуш
веток заблокирован). Командная разработка (PR-ревью, CI, защита `main`)
требует отдельного репозитория. Это разовая ручная операция — у автономного
агента нет `gh`/токена с правом создавать репозитории, только SSH deploy-key
для существующих репо DeviceIngineering, поэтому первые два шага делает
человек.

## Шаг 1 — создать пустой репозиторий (вручную, в веб-интерфейсе GitHub)

1. GitHub → организация **DeviceIngineering** → New repository.
2. Имя: `dobro`. Видимость: **Private** (данные пилота, медицинские сценарии).
3. Не инициализировать README/.gitignore/license — репозиторий должен быть
   пустым, история придёт из монорепо (шаг 2).
4. Добавить SSH-ключ `github_deviceingineering` (уже используется для
   CatalogAI/printfarm-production на этом сервере) как deploy key с правом
   записи, либо убедиться, что он уже имеет доступ на уровне организации.

## Шаг 2 — перенести историю подпапки `dobro/` с сохранением коммитов

Выполнить на сервере (не в самом `ClaudeProjects`, а во временной копии, чтобы
не тронуть монорепо):

```bash
pip install git-filter-repo
cd /tmp
git clone /root/ClaudeProjects dobro-extracted
cd dobro-extracted
git filter-repo --path dobro/ --path-rename dobro/:
git remote add origin git@github.com:DeviceIngineering/dobro.git
git push -u origin main
git push origin --tags   # если к этому моменту уже есть prod-* теги
```

`git filter-repo` перепишет историю так, будто `dobro/` всегда был корнем
репозитория — все 8+ коммитов эволюции `concept-tz-draft.md` (см.
`docs/evolution/`) и вся история кода бота переедут как есть, `git log`/
`git blame` продолжат работать.

## Шаг 3 — настроить репозиторий

- Branch protection на `main` — см. `CONTRIBUTING.md`, раздел 4 (список
  чекбоксов один в один).
- GitHub Environment `production` — Settings → Environments → New environment
  `production` → Required reviewers (владелец проекта) — это даёт ручной
  approval-гейт перед `deploy.yml`/`rollback.yml` (они уже ссылаются на
  `environment: production` в workflow-файлах).
- Secrets (Settings → Secrets and variables → Actions → Secrets):
  `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `DEPLOY_PATH`.
- Variables (та же страница, вкладка Variables): `COVERAGE_MIN` = `25`
  (обоснование — `CONTRIBUTING.md`, раздел 6).
- `.github/CODEOWNERS` — заменить `@owner-placeholder`/`@dev-a-placeholder`/
  `@dev-b-placeholder` на реальные GitHub-логины.
- Пригласить двух разработчиков как collaborators (Write-доступ достаточно —
  `main` защищён правилами, не правами доступа).

## Шаг 4 — перевести локальную разработку (эту сессию/сервер) на новый remote

После успешного переноса — старые ветки `night/dobro-*` в `ClaudeProjects`
можно оставить как архив (история уже сохранена в новом репозитории) либо
удалить после сверки, что ничего не потеряно. Дальнейшая разработка `dobro`
идёт в собственном клоне нового репозитория, не в `ClaudeProjects`.

## Почему не сделано автоматически

`git-filter-repo` не установлен, создание репозитория на GitHub требует
токена с правом `repo`/`admin:org`, которого нет в текущем окружении (только
deploy-key на уже существующие репозитории). Это осознанная точка ручного
подтверждения — операция необратимая (новый публичный/приватный репозиторий
организации, доступ третьих лиц), поэтому не выполняется агентом без явного
запроса.
