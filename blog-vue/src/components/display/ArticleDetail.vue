<template>
  <div v-if="articleLoading">
    <h1 class="title">{{article.title}}</h1>
    <div class="tct">
      <i class="el-icon-time marginrl"></i>发表于
      <span>{{article.date}}</span>
      <span class="marginrl">|</span>
      <i class="el-icon-folder-opened marginrl"></i>
      <span class="category" @click="getArticleByCategory(article.category.id, article.category.category)">{{article.category.category}}</span>
      <span class="marginrl">|</span>
      <span v-for="(it, ind) in article.tags">
        <i class="el-icon-collection-tag marginrl"></i>
        <span class="tag" @click="getArticleByTagId(it.id, it.tag)">{{it.tag}}</span>
      </span>
      <span class="marginrl">|</span>
      <i class="el-icon-view marginrl"></i>
      <span>{{ article.view }}</span>
      <span class="marginrl">|</span>
      <i class="el-icon-trophy marginrl"></i>
      <span>{{ article.praise }}</span>
    </div>
    <div v-html="code" class="article markdown-body"></div>
    <el-row style="text-align: center">
      <el-button @click="praiseArticle(article.id)" type="primary" round>点赞</el-button>
    </el-row>
  </div>
</template>

<script>
  import marked from 'marked'
  import hljs from 'highlight.js'
  import 'highlight.js/styles/atom-one-light.css';
  import '../../assets/github-markdown.css'
  import axios from "axios";

  export default {
    name: "ArticleDetail",
    created() {
      this.articleId = this.$route.query.articleId;
      this.getArticleById(this.articleId);
    },
    methods: {
      praiseArticle(id) {
        axios.get('/article/praise/' + id).then(value => {
          const data = value.data;
          if (data.success) {
            this.$message.success({message: data.message});
          } else {
            this.$message.error({message: data.message})
          }
        })
      },
      getArticleById(id) {
        axios.get('/article/' + id).then(value => {
          const data = value.data;
          if (data.success) {
            this.article = data.content;
            this.getHTML()
          }
        })
      },
      getHTML() {
        marked.setOptions({
          renderer: new marked.Renderer(),
          highlight: function (code) {
            return hljs.highlightAuto(code).value;
          },
          pedantic: false,
          gfm: true,
          tables: true,
          breaks: false,
          sanitize: false,
          smartLists: true,
          smartypants: false,
          xhtml: false
        });
        this.code = marked(this.article.content);
        this.articleLoading = true
      },
      getArticleByCategory(id, category) {
        this.$router.push({path: '/archive', query: {categoryId: id, categoryName: category}});
      },
      getArticleByTagId(id, tag) {
        this.$router.push({path: '/archive', query: {tagId: id, tagName: tag}});
      },
    },
    data() {
      return {
        code: '',
        article: {},
        articleId: '',
        articleLoading: false
      }
    }
  }
</script>

<style scoped>
  .article {
    text-align: left;
  }

  .markdown-body {
    box-sizing: border-box;
    min-width: 200px;
    max-width: 980px;
    margin: 0 auto;
    padding: 45px;
  }

  @media (max-width: 767px) {
    .markdown-body {
      padding: 15px;
    }
  }

  .title {
    margin-bottom: 0;
    text-align: center;
  }

  .tct {
    margin-top: 10px;
    color: #999999;
    font-size: 13px;
    text-align: center;
  }

  .category, .tag {
    cursor: pointer;
  }

  .category:hover, .tag:hover {
    text-decoration: underline;
  }

  .marginrl {
    margin: 0 3px;
  }
</style>
