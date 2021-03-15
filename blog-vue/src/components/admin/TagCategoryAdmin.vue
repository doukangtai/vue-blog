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
          {{tag}}
        </el-tag>
        <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
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
          {{tag}}
        </el-tag>
        <el-input
            class="input-new-tag"
            v-if="inputVisible2"
            v-model="inputValue2"
            ref="saveTagInput2"
            size="small"
            @keyup.enter.native="handleInputConfirm2"
            @blur="handleInputConfirm2"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput2">+ New Category</el-button>
      </div>
    </div>
  </div>
</template>

<script>
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
        let _this = this
        _this.getRequest('/getAllTag').then(value => {
          let tempDynamicTags = []
          for (let i = 0; i < value.data.length; i++) {
            tempDynamicTags.push(value.data[i].tag)
          }
          _this.dynamicTags = tempDynamicTags;
          let tempDynamicTagsArray = []
          for (let i = 0; i < value.data.length; i++) {
            tempDynamicTagsArray.push(value.data[i].id)
          }
          _this.dynamicTagsArray = tempDynamicTagsArray
        })
      },

      handleClose(tag) {
        let _this = this
        let tid = this.dynamicTagsArray[this.dynamicTags.indexOf(tag)]
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        this.deleteRequest('/deleteTag/' + tid).then(value => {
          if (value.data.status == 'success') {
            this.$message({
              message: value.data.msg,
              type: 'success'
            });
          }
          _this.getAllTag()
        }).catch(reason => {
          this.$message({
            message: '未知错误',
            type: 'error'
          });
          _this.getAllTag()
        })
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        let _this = this
        _this.postRequest('/addTag', {
          tag: inputValue
        }).then(value => {
          if (value.data.status == 'success') {
            this.$message({
              message: value.data.msg,
              type: 'success'
            });
          }
          _this.getAllTag()
        }).catch(reason => {
          this.$message({
            message: '未知错误',
            type: 'error'
          });
          _this.getAllTag()
        })
        this.inputVisible = false;
        this.inputValue = '';
      },

      getAllCategory() {
        let _this = this
        _this.getRequest('/getAllCategory').then(value => {
          let tempDynamicTags = []
          for (let i = 0; i < value.data.length; i++) {
            tempDynamicTags.push(value.data[i].category)
          }
          _this.dynamicTags2 = tempDynamicTags;
          let tempDynamicTagsArray = []
          for (let i = 0; i < value.data.length; i++) {
            tempDynamicTagsArray.push(value.data[i].id)
          }
          _this.dynamicTagsArray2 = tempDynamicTagsArray
        })
      },

      handleClose2(tag) {
        let _this = this
        let cid = this.dynamicTagsArray2[this.dynamicTags2.indexOf(tag)];
        this.dynamicTags2.splice(this.dynamicTags2.indexOf(tag), 1);
        this.deleteRequest('/deleteCategory/' + cid).then(value => {
          if (value.data.status == 'success') {
            this.$message({
              message: value.data.msg,
              type: 'success'
            });
          }
          _this.getAllCategory()
        }).catch(reason => {
          this.$message({
            message: '未知错误',
            type: 'error'
          });
          _this.getAllCategory()
        })
      },

      showInput2() {
        this.inputVisible2 = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput2.$refs.input.focus();
        });
      },

      handleInputConfirm2() {
        let inputValue = this.inputValue2;
        let _this = this
        _this.postRequest('/addCategory', {
          category: inputValue
        }).then(value => {
          if (value.data.status == 'success') {
            this.$message({
              message: value.data.msg,
              type: 'success'
            });
          }
          _this.getAllCategory()
        }).catch(reason => {
          this.$message({
            message: '未知错误',
            type: 'error'
          });
          _this.getAllCategory()
        })
        this.inputVisible2 = false;
        this.inputValue2 = '';
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
