<template>
  <div class="pdf-thumbnail">
    <canvas ref="pdfCanvas" class="resource-img"></canvas>
    <div v-if="isLoading" class="loading-indicator">Loading...</div>
  </div>
</template>

<script>
/* global pdfjsLib */

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
  data() {
    return {
      isLoading: true, // Track loading state
      defaultWidth: 300, // Placeholder width for the canvas
      defaultHeight: 400, // Placeholder height for the canvas
    };
  },
  async mounted() {
    console.log("mounting");
    await this.prepareCanvasAndRender();
    console.log("mounted");
    this.isLoading = false;
  },
  methods: {
    async prepareCanvasAndRender() {
      try {
        // Set workerSrc for the PDF.js worker globally
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";
        
        // Set initial placeholder size
        const canvas = this.$refs.pdfCanvas;
        canvas.width = this.defaultWidth;
        canvas.height = this.defaultHeight;

        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument(this.pdfUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        // Calculate actual size based on PDF dimensions
        const viewport = page.getViewport({ scale: this.scale });

        // Update the canvas size based on the PDF's actual dimensions
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const context = canvas.getContext('2d');
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        // Render the PDF page into the canvas
        await page.render(renderContext).promise;
        this.$emit('pdfRendered');
      } catch (error) {
        console.error('Error rendering PDF thumbnail:', error);
      }
    },
  },
};
</script>

<style scoped>
.pdf-thumbnail {
  position: relative;
  width: 100%;
}

.resource-img {
  width: 100%; /* Responsive width */
  display: block;
  border: 1px solid #ddd;
  border-radius: 25px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
  color: #888;
}
</style>