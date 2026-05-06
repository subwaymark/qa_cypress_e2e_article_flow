import { ArgumentError } from '../customCommands.js';
import PageObject from '../pageObject.js';
import HomePageObject from './home.pageObject.js';
import ArticlePageObject from './articlePage.pageObject.js';

class NewArticlePageObject extends PageObject {
  url = '/editor';
  static marks = {
    articleTittleField: 'exist',
    articleAboutField: 'exist',
    articleBodyTextArea: 'exist',
    articleTagsField: 'exist',
    articlePublishButton: 'exist'
  };

  createMarks() {
    for (const mark of Object.keys(NewArticlePageObject.marks)) {
      switch (true) {
        case mark === 'articlePublishButton':
          cy.get('form button')
            .then((button) => {
              if (button.text().includes('Update Article')) {
                [...button].some((btn) => {
                  const isTarget = btn.textContent === 'Update Article';
                  const isDataCyCurrent = btn.hasAttribute('data-cy');

                  if (isTarget && !isDataCyCurrent) {
                    btn.setAttribute('data-cy', 'article-update-newArticle');

                    return true;
                  }

                  return false;
                });
              } else if (button.text().includes('Publish Article')) {
                [...button].some((btn) => {
                  const isTarget = btn.textContent === 'Publish Article';
                  const isDataCyCurrent = btn.hasAttribute('data-cy');

                  if (isTarget && !isDataCyCurrent) {
                    btn.setAttribute('data-cy', 'article-publish-newArticle');

                    return true;
                  }
                  return false;
                });
              } else {
                throw new Error(`The submit button of the form on the New Article Page ` +
                  `doesn't contain "Update Article" or "Publish Article" text`
                );
              }
            });
          break;
      }
    }
  };

  get articleTittleField() {
    return cy.get('form input[placeholder="Article Title"]');
  }

  get articleAboutField() {
    cy.get('form input[placeholder^="What\'s"]');
  }

  get articleBodyTextArea() {
    return cy.get('form textArea[placeholder^="Write your article"]');
  }

  get articleTagsField() {
    return cy.get('form input[placeholder="Enter tags"]');
  }

  get articleSubmitButton() {
    return cy.getByDataCy(
      'article-publish-newArticle', 'article-update-newArticle');
  }

  insertArticleTittle(text) {
    if (typeof text !== 'string') {
      throw new ArgumentError('The "text" argument must be String');
    }

    this.articleTittleField
      .click()
      .clear()
      .type(text);
  }

  insertArticleAbout(text) {
    if (typeof text !== 'string') {
      throw new ArgumentError('The "text" argument must be String');
    }

    this.articleAboutField
      .click()
      .clear()
      .type(text);
  }

  insertArticleBody(text) {
    if (typeof text !== 'string') {
      throw new ArgumentError('The "text" argument must be String');
    }

    this.articleBodyTextArea
      .click()
      .clear()
      .type(text);
  }

  insertArticleTags(textOrArray) {
    const argType = Object.prototype.toString.call(textOrArray);
    const isArray = argType === '[object Array]';
    const isString = argType === '[object String]';
    const iterationLimit = (isString)
      ? 1
      : textOrArray.length;

    if (!(isString || isArray)) {
      throw new ArgumentError('The "text" argument must be String or Array');
    }

    for (let i = 0; i < iterationLimit; i++) { // interation dependend on type of data (String or Array)
      const elementToInput = (isArray)
        ? textOrArray[i]
        : textOrArray;

      if (i === 0) {
        this.articleTagsField
          .click()
          .clear()
          .type(elementToInput);

        this.articleTagsField
          .blur();

        continue;
      }

      this.articleTagsField
        .click()
        .type(elementToInput);
      this.articleTagsField
        .blur();
    }
  }

  clickOnSubmitButton() {
    this.articleSubmitButton
      .click();
    this.articleSubmitButton
      .should('not.be.disabled');
    this.articleMixIn.createMarks(true);
  }

  getAllTags() {
    return cy.get('.tag-list span');
  }

  deleteAllTags() {
    cy.get('.tag-list span i')
      .then((tags) => {
        for (let i = tags.length - 1; i >= 0; i--) {
          cy.get(tags[i]).click();
        }
      });
  }
}

const homePrototype = HomePageObject.prototype;
const articlePrototype = ArticlePageObject.prototype;

NewArticlePageObject.prototype.homeMixIn = {
  getLogo: homePrototype.clickLogo
    .bind(homePrototype),
  getHomeLink: homePrototype.clickHomeLink
    .bind(homePrototype),
  getNewArticleLink: homePrototype.clickNewArticleLink
    .bind(homePrototype),
  getSettingsLink: homePrototype.clickSettingsLink
    .bind(homePrototype),
  getUserLink: homePrototype.clickUserLink
    .bind(homePrototype),
  createMarks: homePrototype.createMarks
    .bind(homePrototype)
};

NewArticlePageObject.prototype.articleMixIn = {
  createMarks: articlePrototype.createMarks
};

export default NewArticlePageObject;
