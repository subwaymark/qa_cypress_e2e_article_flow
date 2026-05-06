/// <reference types='cypress' />
/// <reference types='../support' />
import UserObj from '../support/pageObject.js';
import HomePageObject from '../support/pages/home.PageObject.js';
import Article from '../support/articleObject.js';
import NewArticlePageObject from '../support/pages/newArticle.pageObject.js';
import ArticlePageObject from '../support/pages/articlePage.pageObject.js';

describe('article page', () => {
  const user = new UserObj();
  const homePage = new HomePageObject();
  const newArticlePage = new NewArticlePageObject();
  const articlePage = new ArticlePageObject();
  const article = new Article();

  before(() => {
    cy.register(user.email, user.username, user.password);
  });

  beforeEach(() => {
    cy.login(user.email, user.username, user.password);
  });

  it.only('should provide an ability to create an article', () => {
    homePage.clickNewArticleLink();
    newArticlePage.insertArticleTittle(article.version1.title);
    newArticlePage.insertArticleAbout(article.version1.about);
    newArticlePage.insertArticleBody(article.version1.body);
    newArticlePage.insertArticleTags(article.version1.tags);
    newArticlePage.clickOnSubmitButton();
    articlePage.assertTitleText(article.version1.title);
    articlePage.assertArticleBodyText(article.version1.body);
    articlePage.assertTags(article.version1.tags);
  });

  it('should provide an ability to delete an article', () => {

  });
});
