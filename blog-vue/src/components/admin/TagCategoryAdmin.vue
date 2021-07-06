<template>
  <div>
    <div>
      <div style="margin: 10px">
        标签管理
      </div>
      <div>
        <el-tag
            style="margin: 10px"
            :key="tag"
            v-for="tag in dynamicTags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
          {{ tag }}
        </el-tag>
        <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
      </div>
    </div>

    <div>
      <div style="margin: 10px">
        分类管理
      </div>
      <div>
        <el-tag
            style="margin: 10px"
            :key="tag"
            v-for="tag in dynamicTags2"
            closable
            :disable-transitions="false"
            @close="handleClose2(tag)">
          {{ tag }}
        </el-tag>
        <el-input
            class="input-new-tag"
            v-if="inputVisible2"
            v-model="inputValue2"
            ref="saveTagInput2"
            size="small"
            @blur="handleInputConfirm2"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput2">+ New Category</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TagCategoryAdmin",
  data() {
    return {
      dynamicTags: [],
      dynamicTagsArray: [],
      inputVisible: false,
      inputValue: '',
      dynamicTags2: [],
      dynamicTagsArray2: [],
      inputVisible2: false,
      inputValue2: '',
    };
  },
  mounted() {
    this.getAllTag();
    this.getAllCategory();
  },
  methods: {
    getAllTag() {
      axios.get('/tag/list').then(value => {
        const data = value.data;
        if (data.success) {
          const tags = data.content;
          let tempDynamicTags = [];
          let tempDynamicTagsArray = []
          for (let i = 0; i < tags.length; i++) {
            tempDynamicTags.push(tags[i].tag)
            tempDynamicTagsArray.push(tags[i].id)
          }
          this.dynamicTags = tempDynamicTags;
          this.dynamicTagsArray = tempDynamicTagsArray
        }
      })
    },
    getAllCategory() {
      axios.get('/category/list').then(value => {
        const data = value.data
        if (data.success) {
          const categorys = data.content
          let tempDynamicTags = [];
          let tempDynamicTagsArray = []
          for (let i = 0; i < categorys.length; i++) {
            tempDynamicTags.push(categorys[i].category)
            tempDynamicTagsArray.push(categorys[i].id)
          }
          this.dynamicTags2 = tempDynamicTags;
          this.dynamicTagsArray2 = tempDynamicTagsArray
        }
      })
    },
    handleInputConfirm() {
      axios.post('/tag/add', {
        tag: this.inputValue
      }).then(value => {
        const data = value.data
        if (data.success) {
          this.$message({
            message: '添加标签成功',
            type: 'success'
          });
        } else {
          this.$message({
            message: data.message,
            type: 'error'
          })
        }
        this.getAllTag();
      }).catch(reason => {
        this.$message({
          message: '添加标签失败',
          type: 'error'
        });
        this.getAllTag()
      })
      this.inputVisible = false;
      this.inputValue = '';
    },
    handleClose(tag) {
      let tid = this.dynamicTagsArray[this.dynamicTags.indexOf(tag)]
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      axios.delete('/tag/delete/' + tid).then(value => {
        const data = value.data;
        if (data.success) {
          this.$message({
            message: data.message,
            type: 'success'
          });
        } else {
          this.$message({
            message: data.message,
            type: 'error'
          });
        }
        this.getAllTag();
      }).catch(reason => {
        this.$message({
          message: '删除标签失败',
          type: 'error'
        });
        this.getAllTag()
      })
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm2() {
      axios.post('/category/add', {
        category: this.inputValue2
      }).then(value => {
        const data = value.data
        if (data.success) {
          this.$message({
            message: '添加分类成功',
            type: 'success'
          });
        } else {
          this.$message({
            message: data.message,
            type: 'error'
          })
        }
        this.getAllCategory()
      }).catch(reason => {
        this.$message({
          message: '添加分类失败',
          type: 'error'
        });
        this.getAllCategory()
      })
      this.inputVisible2 = false;
      this.inputValue2 = '';
    },
    handleClose2(tag) {
      let cid = this.dynamicTagsArray2[this.dynamicTags2.indexOf(tag)];
      this.dynamicTags2.splice(this.dynamicTags2.indexOf(tag), 1);
      axios.delete('/category/delete/' + cid).then(value => {
        const data = value.data;
        if (data.success) {
          this.$message({
            message: data.message,
            type: 'success'
          });
        } else {
          this.$message({
            message: data.message,
            type: 'error'
          });
        }
        this.getAllCategory()
      }).catch(reason => {
        this.$message({
          message: '删除分类失败',
          type: 'error'
        });
        this.getAllCategory()
      })
    },
    showInput2() {
      this.inputVisible2 = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput2.$refs.input.focus();
      });
    },
  }
}
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
