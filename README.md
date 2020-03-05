[![NPM Version](https://badge.fury.io/js/i18n-db.svg)](https://badge.fury.io/js/i18n-db)
![CI](https://github.com/justinlettau/i18n-db/workflows/CI/badge.svg)
[![Dependency Status](https://david-dm.org/justinlettau/i18n-db.svg)](https://david-dm.org/justinlettau/i18n-db)
[![Dev Dependency Status](https://david-dm.org/justinlettau/i18n-db/dev-status.svg)](https://david-dm.org/justinlettau/i18n-db?type=dev)

# i18n-db

A lightweight internationalization management tool that uses [SQLite](https://www.sqlite.org/) for managing
translations, with JSON file output. The `i18n` CLI provides quick and easy interaction with the database for
adding and editing locales, resources, and translations; Or you can access the SQLite database directly for complex
queries using something like [SQLite Browser](https://sqlitebrowser.org/).

Advantages over manually maintaining JSON files:

- Automatically identify missing translations.
- Audit fields track when translations change, identifying when existing translations need review.
- Export/import translations files for working with translators or third party tools.
- Write your own SQLite queries for complex or unique use cases.

# Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Examples](#examples)
- [Development](#development)

# Features

- 📥 **Import/export** `xliff`, `csv`, and `json` files.
- 👀 Know exactly what resources **need translations** or updates.
- 🎉 **Works with any library** that uses JSON as a source for locale resources.
- 🚀 Nice and **simple CLI**.
- 💪 Uses **SQLite**, so you can write custom queries or manipulate data however you want.

# Installation

```bash
npm install -g i18n-db
```

# Usage

```bash
i18n-db --help
```

### `init`

Setup configuration and initialize database.

```
i18n init
```

Options:

| Option            | Alias | Type     | Description                                                         | Default  |
| ----------------- | ----- | -------- | ------------------------------------------------------------------- | -------- |
| `--defaultLocale` | `-l`  | `string` | Default locale to set.                                              | `en-US`  |
| `--directory`     | `-d`  | `string` | Directory to store database and generated files, relative to root.. | `./i18n` |

### `import [file]`

Import translation records.

Options:

| Option     | Alias | Type     | Description                                    | Default         |
| ---------- | ----- | -------- | ---------------------------------------------- | --------------- |
| `--format` | `-f`  | `string` | File format. Available: `xliff`, `csv`, `json` | `xliff`         |
| `--locale` | `-l`  | `string` | Locale code to import translations for.        | `defaultLocale` |

### `export`

Alias: `x`

Export translations for translation. Files are created at `./i18n-export`; This directory can be added to gitignore.

Options:

| Option     | Alias | Type     | Description                                           | Default |
| ---------- | ----- | -------- | ----------------------------------------------------- | ------- |
| `--format` | `-f`  | `string` | Output file format. Available: `xliff`, `csv`, `json` | `xliff` |
| `--locale` | `-l`  | `string` | Locale code to export translations for.               | all     |

### `generate`

Alias: `g`

Generate locale JSON files. A file for each locale will be generated that contains translated resources. Any resources
that are missing a translation for a locale will not be included in the generated file.

Example output file structure:

```
./i18n
  en-US.json
  es-MX.json
  fr-CA.json
```

Example output file content:

```
// en-US.json

{
  "key": "translation value",
  "Greeting": "Hello World!",
  ...
}
```

### `locale list`

Aliases:

- `locale ls`
- `l ls`

List all locales.

### `locale set [code]`

Alias: `l set [code]`

Add/update a locale record.

Options:

| Option       | Alias | Type     | Description       | Default |
| ------------ | ----- | -------- | ----------------- | ------- |
| `--fullName` | `-n`  | `string` | Locale full name. | n/a     |

### `locale remove [code]`

Aliases:

- `l remove [code]`
- `l rm [code]`

Remove a locale record and all associated translations.

### `resource list`

Aliases:

- `l list`
- `l ls`

List all resources.

### `translate list [key]`

Aliases:

- `t list [key]`
- `t ls [key]`

List translations by resource.

### `translate set [key] [value]`

Alias: `t set [key] [value]`

Add/update a translation record.

Options:

| Option     | Alias | Type     | Description              | Default         |
| ---------- | ----- | -------- | ------------------------ | --------------- |
| `--desc`   | `-d`  | `string` | Resource description.    | n/a             |
| `--locale` | `-l`  | `string` | Translation locale code. | `defaultLocale` |

# Configuration

Configuration options are stored in a `i18n.json` file. The following properties are supported:

| Name            | Type     | Description                                                        |
| --------------- | -------- | ------------------------------------------------------------------ |
| `defaultLocale` | `string` | Default locale.                                                    |
| `directory`     | `string` | Directory to store database and generated files, relative to root. |

# Examples

Adding translations from scratch.

```bash
i18n init

# add translation to default locale
i18n translation set "Greeting" "Hello"

# add more locales
i18n locale set "es-MX"
i18n locale set "zh"

# add a translations of "Greeting" for new locales
i18n translation set "Greeting" "Hola" --locale "es-MX"
i18n translation set "Greeting" "你好" --locale "zh"

# generate locale files
i18n generate
```

Add translations from a translator.

```bash
i18n init

# add translation to default locale
i18n translation set "Greeting" "Hello"

# add another locale
i18n locale set "es-MX"

# export translation file(s) for translator
i18n export

# send "es-MX.xliff" file to translator ...

# import translations
i18n import ./es-MX_done.xliff

# generate locale files
i18n generate
```

# Development

Clone the repo and run the following commands in the `i18n-db` directory:

```bash
npm install
npm link
npm run build
```
