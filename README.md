### WebGPU Atomics Benchmark

A simple test of the throughput of atomics on your gpu using webgpu.

While building a custom GPU memory allocator for my game engine, I've been relying heaviy on atomics. Inspired by the old [CUDA blog post on warp-aggregated atomics](https://developer.nvidia.com/blog/cuda-pro-tip-optimized-filtering-warp-aggregated-atomics/) which demonstrated that compiler magic can counterintuitively make certain GPU atomics extremely fast (faster than a CPU), I've been very curious to know if the same holds true for modern APIs and GPUs. Results indicate that even on non-nvidia systems and high level APIs such as WebGPU, these optimizations are clearly available!

*PRs adding results for your GPU are welcome!*


----

Current configuration is 32 atomic adds per thread, launching a total of 15M threads.

| GPU | Max Bandwidth | Ops/s | Bandwidth Utilization* | 
|----- | ----- | ----- | ----- |
|M1 Max | 400 GB/s | 20B | 40% |
| RTX 4090 | 1008 GB/s | 62B | 49% |

*This may not be actual global memory utilization, but the utilization that would be required if operations were not aggregated prior to global memory.

----
### Find out your GPU's performance 

1. Go to https://pwhiddy.github.io/webgpu-atomics-benchmark/  

2. Copy the result: `Operations per second`  

3. Calculate results using this formula:

```python
operations_per_second = # your result here
gpu_max_bandwidth = # your gpu max bandwidth (look this up online)
# 1 read + 1 write for a 4 byte u32
bandwidth_utilized = ((operations_per_second * 4 * 2) / gpu_max_bandwidth) * 100
```

