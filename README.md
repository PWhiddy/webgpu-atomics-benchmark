### WebGPU Atomics Benchmark

A simple test of the throughput of atomics on your gpu using webgpu.

*PRs adding results for your GPU are welcome!*


----

Current configuration is 32 atomic adds per thread, launching a total of 15M threads.

| GPU | Max Bandwidth | Ops/s | Bandwidth Utilization* | 
|----- | ----- | ----- | ----- |
|M1 Max | 400 GB/s | 20B | 40% |
| RTX 4090 | 1008 GB/s | 62B | 49% |

*This is likely not actual global memory utilization, but the utilization that would be required if operations were not collessed prior to global memory.

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

