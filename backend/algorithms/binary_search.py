def binary_search(num_to_find, sorted_list):
    right_side = 0
    left_side = len(sorted_list) - 1
    steps = 0
    while right_side <= left_side:
        steps += 1
        middle = (right_side + left_side) // 2
        if sorted_list[middle] == num_to_find:
            return steps

        if sorted_list[middle] < num_to_find:
            right_side = middle + 1

        if num_to_find < sorted_list[middle]:
            left_side = middle - 1

    return steps

def main():
    num_list = [n for n in range(1, 101)]
    print(num_list)
    print(binary_search(23, num_list))

if __name__ == "__main__":
    main()