# Contributing

We opened sourced Pezzo because we believe in the power of community. We believe you can help making Pezzo better!
We are excited to see what you will build with Pezzo and we are looking forward to your contributions. We want to make contributing to this project as easy and transparent as possible, whether it's features, bug fixes, documentation updates, guides, examples and more.

## How can I contribute?

Ready to contribute but seeking guidance, we have several avenues to assist you. Explore the upcoming segment for clarity on the kind of contributions we appreciate and how to jump in. Reach out directly to the Pezzo team on [Discord](https://discord.gg/h5nBW5ySqQ) for immediate assistance! Alternatively, you're welcome to raise an issue and one of our dedicated maintainers will promptly steer you in the right direction!

## Found a bug?

If you find a bug in the source code, you can help us by [submitting an issue](https://github.com/pezzolabs/pezzo/issues/new?assignees=&labels=bug&projects=&template=bug_report.yaml) to our GitHub Repository. Even better, you can submit a Pull Request with a fix.

## Missing a feature?

So, you've got an awesome feature in mind? Throw it over to us by [creating an issue](https://github.com/pezzolabs/pezzo/issues/new?assignees=&labels=feature-request&projects=&template=feature_request.yaml) on our GitHub Repo.

Planning to code a feature yourself? We love the enthusiasm, but hang on, always good to have a little chinwag with us before you burn that midnight oil. Unfortunately, not every feature might fit into our plans.

- Dreaming big? Kick off by opening an issue and sketch out your cool ideas. Helps us all stay on the same page, avoid doing the same thing twice, and ensures your hard work gels well into the project.
- Cooking up something small? Just craft it and [shoot it straight as a Pull Request](#submit-pr).

## What do you need to know to help?

If you want to help out with a code contribution, our project uses the following stack:

### Server-side

- [Node.JS](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/docs)
- [NestJS](https://docs.nestjs.com/)
- [Prisma](https://www.prisma.io/docs/) (with [PostgreSQL](https://www.postgresql.org/about/))
- [GraphQL API](https://docs.nestjs.com/graphql/quick-start)
- [Jest](https://docs.nestjs.com/fundamentals/testing) (for testing)

### Client-side

- [React](https://reactjs.org/docs/getting-started.html)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Apollo Client](https://www.apollographql.com/docs/react/)

If you don't feel ready to make a code contribution yet, no problem! You can also check out the [documentation issues](https://github.com/pezzolabs/pezzo/labels/type%3A%20docs).

# How do I make a code contribution?

## Good first issues

Are you new to open source contribution? Wondering how contributions work in our project? Here's a quick rundown.

Find an issue that you're interested in addressing, or a feature that you'd like to add.
You can use [this view](https://github.com/pezzolabs/pezzo/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) which helps new contributors find easy gateways into our project.

## Step 1: Make a fork

Fork the Pezzo repository to your GitHub organization. This means that you'll have a copy of the repository under _your-GitHub-username/repository-name_.

## Step 2: Clone the repository to your local machine

```
git clone https://github.com/{your-GitHub-username}/pezzo.git

```

## Step 3: Prepare the development environment

Set up and run the development environment on your local machine:

**BEFORE** you run the following steps make sure:

1. You have typescript installed locally on you machine `npm install -g typescript`
2. You are using node version: ^18.16.0 || ^14.0.0"
3. You are using npm version: ^8.1.0 || ^7.3.0"
4. You have `docker` installed and running on your machine

```shell
cd pezzo
npm install
```

## Step 4: Create a branch

Create a new branch for your changes.
In order to keep branch names uniform and easy-to-understand, please use the following conventions for branch naming.
Generally speaking, it is a good idea to add a group/type prefix to a branch.
Here is a list of good examples:

- for docs change : docs/{ISSUE_NUMBER}-{CUSTOM_NAME}
- for new features : feat/{ISSUE_NUMBER}-{CUSTOM_NAME}
- for bug fixes : fix/{ISSUE_NUMBER}-{CUSTOM_NAME}

```jsx
git checkout -b branch-name-here
```

## Step 5: Make your changes

Update the code with your bug fix or new feature.

## Step 6: Add the changes that are ready to be committed

Stage the changes that are ready to be committed:

```jsx
git add .
```

## Step 7: Commit the changes (Git)

Commit the changes with a short message. (See below for more details on how we structure our commit messages)

```jsx
git commit -m "<type>(<package>): <subject>"
```

## Step 8: Push the changes to the remote repository

Push the changes to the remote repository using:

```jsx
git push origin branch-name-here
```

## Step 9: Create Pull Request

In GitHub, do the following to submit a pull request to the upstream repository:

1.  Give the pull request a title and a short description of the changes made. Include also the issue or bug number associated with your change. Explain the changes that you made, any issues you think exist with the pull request you made, and any questions you have for the maintainer.

Remember, it's okay if your pull request is not perfect (no pull request ever is). The reviewer will be able to help you fix any problems and improve it!

2.  Wait for the pull request to be reviewed by a maintainer.

3.  Make changes to the pull request if the reviewing maintainer recommends them.

Celebrate your success after your pull request is merged :-)

## Git Commit Messages

We structure our commit messages like this:

```
<type>(<package>): <subject>
```

Example

```
fix(server): missing entity on init
```

### Types:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Changes to the documentation
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

### Packages:

- **server**
- **console**
- **integrations**
- **client**

## Code of conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

[Code of Conduct](https://github.com/pezzolabs/pezzo/blob/main/CODE_OF_CONDUCT.md)

Our Code of Conduct means that you are responsible for treating everyone on the project with respect and courtesy.
