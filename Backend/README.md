## HtiRestApiProject

Laravel 12 REST API backend providing CRUD endpoints for a survey / questionnaire platform including: types, questionnaires, question types, questions, answers, surveys, tickets, responses, categories, requests, and options. Validation is centralized in lightweight DTO classes (StoreDto / UpdateDto) for each resource. Factories and seeders generate demo data.

---

### Tech Stack
- PHP ^8.2
- Laravel Framework ^12
- Mysql

### Project Structure (highlights)
```
app/
	Models/                # Eloquent models
	Dtos/<Entity>Dtos/     # StoreDto & UpdateDto per entity
	Http/Controllers/api/  # API controllers (resource style)
database/
	migrations/            # Schema definitions
	factories/             # Model factories
	seeders/               # Database seeders (DatabaseSeeder orchestrates)
routes/api.php           # Registered API routes
```

### Getting Started

1. Clone & install dependencies
```
git clone <repo-url>
cd HtiRestApiProject
composer install
```
2. Environment file & key
```
copy .env.example .env
php artisan key:generate
```
3. Database
- Name `htireport`.

4. Run migrations & seed
```
php artisan migrate:fresh --seed
```

5. Serve API
```
php artisan serve
# API base: http://127.0.0.1:8000/api
```

### API Overview
All endpoints are standard Laravel `apiResource` routes:

| Entity | Route Base | Notes / Filters (query params) |
|--------|------------|--------------------------------|
| Type | /api/types |  |
| Questionnaire | /api/questionnaires | ?type_id=  |
| Questiontype | /api/questiontypes | |
| Question | /api/questions | ?questionnaire_id= ?questiontype_id=  |
| Answer | /api/answers | ?question_id= |
| Survey | /api/surveys | ?type_id=  |
| Ticket | /api/tickets | ?survey_id= ?status= |
| Response | /api/responses | ?survey_id= ?ticket_id= |
| Category | /api/categories |  |
| Request | /api/requests | ?category_id=  |
| Option | /api/options | ?data_type= ?active_on=YYYY-MM-DD |

Common list params:
- `per_page` (default 15) for pagination
- Resource-specific filters as above

### Validation Pattern (DTOs)
Each resource has:
- `StoreDto`: required rules for creation
- `UpdateDto`: `sometimes|...` rules enabling partial updates

Usage in controllers:
```
$dto = new StoreDto($request->all());
$model = Model::create($dto->toArray());
```

### Seeding Strategy
`DatabaseSeeder`:
1. Disables FK checks
2. Truncates tables in dependency-safe order
3. Creates a default user
4. Runs individual seeders (types → questionnaires → ... → options)

You can re-generate demo data:
```
php artisan migrate:fresh --seed
```

### Factories & States Examples
```
Option::factory()->active()->create();
Option::factory()->expired()->count(3)->create();
Request::factory()->required()->create();
```


### Testing
Basic scaffolding present (`tests/Feature` & `tests/Unit`). Add tests and run:
```
php artisan test
```



### Environment Notes
Switch DB: edit `.env` (e.g., set `DB_CONNECTION=mysql`, credentials, then run migrations).

Queue / Logs helpers (optional):
```
php artisan queue:listen
php artisan pail
```

### Deployment Checklist
- Set `APP_ENV=production`, `APP_DEBUG=false`
- Run `php artisan config:cache route:cache view:cache event:cache`
- Ensure correct DB & queue drivers configured
- Run migrations & (optionally) seed minimal data

### Extending
To add a new entity:
1. Create migration & model
2. Add DTOs (Store, Update)
3. Add factory & seeder
4. Add controller (pattern match existing ones)
5. Register `apiResource` route
6. Update `DatabaseSeeder`

### License
MIT

---
Generate issues or PRs to improve docs, tests, or add new domain features.


php artisan jwt:secret
