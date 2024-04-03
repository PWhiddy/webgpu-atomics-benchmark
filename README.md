### WebGPU Atomics Benchmark

A simple test of the throughput of atomics on your gpu using webgpu.

*PRs adding results for your GPU are welcome!*


----

Current configuration is 32 atomic adds per thread, launching a total of 15M threads.

| GPU | Max Flops | Max Bandwidth | Ops/s | Flops Utilization | Bandwidth Utilization | 
|----- | ----- | ----- | ----- | --- | -- |
|M1 Max GPU | ~10 TFlops | ~400 GB/s | 20B | 0.2% | 20% |


----

To calculate results for your GPU use the formula:

```python
operations_per_second = # your result here

# look these two up online
gpu_max_flops = # your gpu max flops
gpu_max_bandwidth = # your gpu max bandwidth
flops_utilized = (operations_per_second / gpu_max_flops) * 100
bandwidth_utilized = ((operations_per_second * 4) / gpu_max_bandwidth) * 100
```

