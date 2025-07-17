SortingVisualizer.prototype.insertionSort = async function () {
  const n = this.array.length;
  for (let i = 1; i < n; i++) {
    let key = this.array[i];
    let j = i - 1;

    while (j >= 0 && this.array[j] > key) {
      await this.animateComparison(j, i);
      this.array[j + 1] = this.array[j];
      const bars = this.arrayContainer.children;
      bars[j + 1].style.height = `${this.array[j + 1]}px`;
      j--;
      await this.sleep(this.animationSpeed / 2);
    }

    this.array[j + 1] = key;
    const bars = this.arrayContainer.children;
    bars[j + 1].style.height = `${key}px`;
  }
};
