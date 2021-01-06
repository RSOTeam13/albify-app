<template>
  <div class="mt-5">
    <div v-if="loading" class="container">
      <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
    </div>
    <div class="row images mt-5 pt-5 pl-5 pr-5" v-else-if="images.length > 0">
      <div v-for="(image) in images" :key="image.id" class="col-12 col-lg-6 col-xl-4 pb-4">
        <b-card>
          <img :src="image.url" width="100%" height="100%" class="image-box"/>
          <b-button @click="getCommentsModal(image)" class="mt-3 ml-3" size="sm">Show comments</b-button>
          <b-button @click="addCommentModal(image)" class="mt-3" size="sm">Add comments</b-button>
          <div class="mr-3 ml-3 mt-2">
            <b-badge v-for="(tag, idx) in image.tags" :key="idx" variant="success" class="mr-1">
              {{ tag }}
            </b-badge>
          </div>
        </b-card>
      </div>
    </div>
    <div v-else class="container">
      You haven't uploaded any images yet.
    </div>

    <b-modal
      id="modal-add-comment"
      title="Add new comment"
      centered
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="addComment">
        <b-form-group
          label="Comment"
          label-for="comment-input"
        >
          <b-form-input
            id="comment-input"
            v-model="newComment"
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>

    <b-modal
      id="modal-show-comments"
      ref="modal"
      title="Image comments"
      centered
      scrollable
      hide-footer
    >

      <div v-if="selectedImageComments.length > 0" class="row">
        <div v-for="comment in selectedImageComments" :key="comment.id" class="col-12 pb-2">
          <b-card :sub-title="comment.createdAt">
            {{ comment.text }}
          </b-card>
        </div>
      </div>
      <div v-else>
        This image has no comments.
      </div>
    </b-modal>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  data () {
    return {
      images: [],
      selectedImage: {},
      loading: false,
      newComment: "",
      selectedImageComments: []
    }
  },
  async mounted () {
    await this.getImages()
  },
  methods: {
    async getImages() {
      this.loading = true
      try {
        const res = await this.$axios.get('/image-service/v1/images/visible')
        this.images = res.data
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      this.addComment()
    },
    async handleSubmit() {
      try {
        const res = await this.$axios.post('/album-service/v1/albums', {
          name: this.newAlbumName
        })

        this.albums.push(res.data)
        this.$bvModal.hide('modal-create-album')

        this.$bvToast.toast('Album was created successfully!', {
          title: 'Success',
          toaster: 'b-toaster-bottom-right',
          variant: 'success',
          solid: true,
        })
      } catch (error) {
        console.log(error)

        this.$bvToast.toast('There was an error while creating new album.', {
          title: 'Error',
          toaster: 'b-toaster-bottom-right',
          variant: 'danger',
          solid: true,
        })
      }      
    },
    async addCommentModal(image) {
      this.selectedImage = image
      this.newComment = ""
      this.$bvModal.show('modal-add-comment')
    },
    async addComment() {
      try {
        const user = !!localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
        const userId = user !== null ? user.id : "123"
        const client = this.$apollo.getClient()
 
        await this.$apollo.mutate({
          mutation: gql`mutation addComment($comment: CommentInput!) {
            addComment(comment: $comment) {
              id
            }
          }`,
          variables: {
            comment: {
              ownerId: userId,
              imageId: this.selectedImage.id,
              text: this.newComment
            },
          },
        })

        this.$bvModal.hide('modal-add-comment')
        this.$bvToast.toast('Comment was successfully added!', {
          title: 'Success',
          toaster: 'b-toaster-bottom-right',
          variant: 'success',
          solid: true,
        })
      } catch (error) {
        console.log(error)

        this.$bvToast.toast('There was an error while adding new comment.', {
          title: 'Error',
          toaster: 'b-toaster-bottom-right',
          variant: 'danger',
          solid: true,
        })
      }
    },
    async getCommentsModal(image) {
      this.selectedImage = image
      this.selectedImageComments = []
      await this.getComments()
    },
    async getComments() {
      try {
        const client = this.$apollo.getClient()

        await this.$apollo.query({
          query: gql`query allComments($id: String!, $offset: Int!, $limit: Int!) {
            allComments(id: $id, offset: $offset, limit: $limit) {
              id,
              ownerId,
              text,
              createdAt
            }
          }`,
          variables: {
            id: this.selectedImage.id,
            offset: 0,
            limit: 100,
          },
        })
        .then(({ data }) => {
          this.selectedImageComments = data.allComments
          console.log(this.selectedImageComments)
          this.$bvModal.show('modal-show-comments')
        })
      } catch (error) {
        console.log(error)

        this.$bvToast.toast('There was an error while fetching comments.', {
          title: 'Error',
          toaster: 'b-toaster-bottom-right',
          variant: 'danger',
          solid: true,
        })
      }
    }
  }
}
</script>

<style scoped>
.images {
  background: #f6f6f6;
}

.images .card-body {
  padding-top: 0;
  padding-left: 0;
  padding-right: 0;
}

.select-album {
  cursor: pointer;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 150px;
}


.fab {
  z-index: 900;
	position: fixed;
	width: 4rem;
	height: 4rem;
	bottom: 2.3rem;
	right: 2.3rem;
	background-color: #a745c4;
	color: white;
	border-radius: 50px;
	text-align: center;
  box-shadow: 2px 2px 3px #999;
  font-size: 50px;
  cursor: pointer;
}

</style>
