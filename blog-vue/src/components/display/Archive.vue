<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item placement="bottom" v-if="categoryName"><h4>{{categoryName}}</h4></el-timeline-item>
      <el-timeline-item placement="bottom" v-else-if="tagName"><h4>{{tagName}}</h4></el-timeline-item>
      <el-timeline-item placement="bottom" v-else><h4>时间线</h4></el-timeline-item>
      <el-timeline-item v-for="(item, index) in article" :timestamp="item.date" placement="top">
        <el-card>
          <h4 class="title" @click="getArticleDetail(item.id)">{{item.title}}</h4>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "Archive",
    mounted() {
      this.categoryId = this.$route.query.categoryId;
      this.categoryName = this.$route.query.categoryName;
      this.tagId = this.$route.query.tagId;
      this.tagName = this.$route.query.tagName;
      if (this.categoryId) {
        axios.get('/article/category/' + this.categoryId).then(value => {
          const data = value.data;
          if (data.success) {
            this.article = data.content;
          }
        })
      } else if (this.tagId) {
        axios.get('/article/tag/' + this.tagId).then(value => {
          const data = value.data;
          if (data.success) {
            this.article = data.content;
          }
        })
      } else {
        this.getAllArticle();
      }
    },
    methods: {
      getAllArticle() {
        axios.get('/article/list').then(value => {
          const data = value.data;
          if (data.success) {
            this.article = data.content
          }
        })
      },
      getArticleDetail(id) {
        this.$router.push({path: '/articleDetail', query: {articleId: id}});
      }
    },
    data() {
      return {
        article: [],
        categoryId: {},
        categoryName: {},
        tagId: {},
        tagName: {},
      }
    }
  }
</script>

<style scoped>
  .title {
    cursor: pointer;
  }
</style>
