import spacy

def main():
    print("Hello from x5case!")
    
    # Проверяем, включен ли GPU
    if spacy.prefer_gpu():
        print("GPU is enabled!")
    else:
        print("GPU is NOT enabled!")
    


if __name__ == "__main__":
    main()
