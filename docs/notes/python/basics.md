# Python 基础语法

> 这是一篇**示例笔记**，用来演示排版效果。内容可以直接替换成你自己的。

## 变量与类型

Python 是动态类型语言，变量不需要声明类型：

```python
name = "zjc"        # str
age = 24            # int
score = 95.5        # float
is_student = True   # bool
```

## 常用数据类型对比

| 类型 | 可变? | 有序? | 典型用途 |
| --- | --- | --- | --- |
| `list` | 可变 | 有序 | 需要频繁增删的序列 |
| `tuple` | 不可变 | 有序 | 固定结构，如坐标 `(x, y)` |
| `dict` | 可变 | 有序* | 键值映射 |
| `set` | 可变 | 无序 | 去重、集合运算 |

（*Python 3.7+ 的 dict 保持插入顺序。）

## 列表推导式

用一行代替循环 + append：

```python
squares = [x * x for x in range(10) if x % 2 == 0]
# [0, 4, 16, 36, 64]
```

::: tip 小技巧
推导式里加 `if` 过滤，比先 append 再 filter 更清晰，也更快。
:::

## 函数与类型注解

```python
def greet(name: str, times: int = 1) -> str:
    """返回拼接好的问候语。"""
    return f"你好，{name}！" * times

print(greet("zjc", 2))
```

## 常见坑

::: warning 可变默认参数
不要这样写：

```python
def add(item, bucket=[]):   # ❌ bucket 是所有调用共享的同一个列表
    bucket.append(item)
    return bucket
```

正确写法：

```python
def add(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket
```
:::

## 参考资料

- [Python 官方教程](https://docs.python.org/zh-cn/3/tutorial/)
- 返回 [笔记总览](../index.md)
