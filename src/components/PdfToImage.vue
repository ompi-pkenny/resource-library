<template>
  <div class="pdf-thumbnail">
    <canvas ref="pdfCanvas" class="resource-img"></canvas>
  </div>
</template>

<script>
import * as pdfjsLib from 'pdfjs-dist/webpack';

export default {
  name: 'PdfThumbnail',
  props: {
    pdfUrl: {
      type: String,
      required: true,
    },
    scale: {
      type: Number,
      default: 0.5, // Adjust the scale as needed
    },
  },
  mounted() {
    this.renderThumbnail();
  },
  methods: {
    async renderThumbnail() {
      try {
        // Directly load the PDF document using pdfjsLib
        const loadingTask = pdfjsLib.getDocument(this.pdfUrl);
        const pdf = await loadingTask.promise;

        // Fetch the first page
        const page = await pdf.getPage(1);

        // Prepare the canvas
        const viewport = page.getViewport({ scale: this.scale });
        const canvas = this.$refs.pdfCanvas;
        const context = canvas.getContext('2d');
        // canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render the PDF page into the canvas context
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;
      } catch (error) {
        console.error('Error rendering PDF thumbnail:', error);
      }
    },
  },
};
</script>

<style scoped>
.resource-img {
  width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 25px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}


</style>