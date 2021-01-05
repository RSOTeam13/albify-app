<template>
  <div class="mt-5">
    <div class="row mt-5 pt-5 pl-5 pr-5" v-if="images.length > 0">
      <div v-for="(image) in images" :key="image.id" class="col-12 col-lg-6 col-xl-4 pb-4 image-box">
        <b-card>
          <img :src="image.url" width="100%" height="100%"/>
          <b-button @click="removeImage(image.id)" class="mt-3" size="sm">Remove</b-button>
          <b-button @click="addImageToAlbumModal(image)" class="mt-3" size="sm">Add to album</b-button>
          <b-button v-if="image.visible" @click="changeVisibility(image.id, false)" class="mt-3" size="sm">Make private</b-button>
          <b-button v-if="!image.visible" @click="changeVisibility(image.id, true)" class="mt-3" size="sm">Make public</b-button>
          <b-badge v-for="(tag, idx) in image.tags" :key="idx" variant="success" class="mr-1">
            {{ tag }}
          </b-badge>
        </b-card>
      </div>
    </div>
    <div v-else class="container">
      You haven't uploaded any images yet.
    </div>

    <b-modal
      id="modal-add-image-album"
      ref="modal"
      title="Add image to album"
      centered
      scrollable
      hide-footer
    >

      <div v-if="selectedImageAlbums.length > 0" class="row">
        <div v-for="album in selectedImageAlbums" :key="album.id" class="col-12 pb-2 select-album">
          <b-card @click="addImageToAlbum(album.id)">
            {{ album.name }}
          </b-card>
        </div>
      </div>
      <div v-else>
        You can't add this image to any album.
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      images: [],
      albums: [],
      selectedImage: {},
      selectedImageAlbums: [],
    }
  },
  async mounted () {
    await this.getImages()
    await this.getAlbums()
  },
  methods: {
    async getImages() {
      try {
        const res = await this.$axios.get('http://localhost:8081/v1/images')
        this.images = res.data
      } catch (error) {
        console.log(error)
      }
    },
    async getAlbums() {
      try {
        const res = await this.$axios.get('/albums')
        this.albums = res.data
      } catch (error) {
        console.log(error)
      }
    },
    async removeImage(id) {
      try {
        const res = await this.$axios.delete(`http://localhost:8081/v1/images/${id}`)
        this.images = this.images.filter((i) => i.id !== id)

        this.$bvToast.toast('Image was removed successfully!', {
          title: 'Success',
          toaster: 'b-toaster-bottom-right',
          variant: 'success',
          solid: true,
        })
      } catch (error) {
        console.log(error)

        this.$bvToast.toast('There was an error while removing the iamge.', {
          title: 'Error',
          toaster: 'b-toaster-bottom-right',
          variant: 'danger',
          solid: true,
        })
      }      
    },
    async addImageToAlbumModal(image) {
      this.selectedImageAlbums = []
      this.selectedImage = image

      for (const album of this.albums) {
        const includesImage = !!album.images.find((i) => i == image.id)
        if (!includesImage) {
          this.selectedImageAlbums.push(album)
        }
      }

      this.$bvModal.show('modal-add-image-album')
    },
    async addImageToAlbum(albumId) {
      try {
        const res = await this.$axios.put(`/albums/${albumId}/images`, {
          id: this.selectedImage.id
        })

        this.$bvModal.hide('modal-add-image-album')
        await this.getAlbums()

        this.$bvToast.toast('Image was successfully added to the album!', {
          title: 'Success',
          toaster: 'b-toaster-bottom-right',
          variant: 'success',
          solid: true,
        })
      } catch (error) {
        console.log(error)

        this.$bvToast.toast('There was an error while adding image to the album.', {
          title: 'Error',
          toaster: 'b-toaster-bottom-right',
          variant: 'danger',
          solid: true,
        })
      }
    },
    async changeVisibility(imageId, visible) {
       try {
        const res = await this.$axios.put(`http://localhost:8081/v1/images/${imageId}/visibility?visible=${visible}`)
        await this.getImages()

        this.$bvToast.toast('Image visibility was successfully updated!', {
          title: 'Success',
          toaster: 'b-toaster-bottom-right',
          variant: 'success',
          solid: true,
        })
      } catch (error) {
        console.log(error)

        this.$bvToast.toast('There was an error while updating image visibility.', {
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
.select-album {
  cursor: pointer;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 150px;
}
</style>
