# Unity Integration for Flip Card Game

This guide provides step-by-step instructions for integrating a Unity-powered 3D flip card game into the React Native application.

## Prerequisites

- [Unity](https://unity.com/download) (2020.3 LTS or newer recommended)
- [React Native](https://reactnative.dev/docs/environment-setup) development environment
- Xcode (for iOS)
- Android Studio (for Android)

## Setup Steps

### 1. Install React Native Unity View

The package is already installed in the project. If you need to install it manually, run:

```bash
npm install react-native-unity-view --save
```

### 2. Create a Unity Project

1. Open Unity Hub and create a new 3D project
2. Name it "FlipCardGame3D"
3. Save it in a location of your choice (recommended: create a `unity` folder at the project root)

### 3. Set Up the Unity Project

1. Create the following folder structure in your Unity project:
   ```
   Assets/
   ├── Scripts/
   │   ├── GameController.cs
   │   ├── Card.cs
   │   ├── CardManager.cs
   │   └── UnityMessageManager.cs
   ├── Prefabs/
   │   ├── Card.prefab
   │   └── GameBoard.prefab
   ├── Scenes/
   │   └── FlipCardGame.unity
   ├── Materials/
   ├── Textures/
   ├── Models/
   └── Plugins/
   ```

2. Implement the C# scripts (see sample implementations below)

### 4. Unity Game Implementation

#### 4.1 Card.cs

```csharp
using System.Collections;
using UnityEngine;

public class Card : MonoBehaviour
{
    public int id;
    public int pairId;
    public string content;
    public string type;
    public bool isFlipped = false;
    public bool isMatched = false;

    public Material frontMaterial;
    public Material backMaterial;
    public TextMesh contentText;

    private bool isFlipping = false;
    private CardManager cardManager;

    void Start()
    {
        cardManager = FindObjectOfType<CardManager>();
        UpdateVisuals();
    }

    void UpdateVisuals()
    {
        MeshRenderer renderer = GetComponent<MeshRenderer>();
        
        if (isFlipped || isMatched)
        {
            renderer.material = frontMaterial;
            contentText.text = content;
        }
        else
        {
            renderer.material = backMaterial;
            contentText.text = "?";
        }

        if (isMatched)
        {
            // Add a matched effect
            transform.position = new Vector3(transform.position.x, 0.1f, transform.position.z);
        }
    }

    public void OnMouseDown()
    {
        if (!isFlipped && !isMatched && !isFlipping && cardManager.CanFlipCard())
        {
            StartCoroutine(FlipCardAnimation());
        }
    }

    IEnumerator FlipCardAnimation()
    {
        isFlipping = true;
        cardManager.FlipCard(this);
        
        float duration = 0.5f;
        float elapsedTime = 0f;
        Quaternion startRotation = transform.rotation;
        Quaternion targetRotation = Quaternion.Euler(0, 180, 0) * startRotation;
        
        // First half of animation
        while (elapsedTime < duration / 2)
        {
            transform.rotation = Quaternion.Slerp(startRotation, targetRotation, elapsedTime / (duration / 2));
            elapsedTime += Time.deltaTime;
            yield return null;
        }
        
        // Update material at the halfway point
        isFlipped = true;
        UpdateVisuals();
        
        // Second half of animation
        while (elapsedTime < duration)
        {
            transform.rotation = Quaternion.Slerp(targetRotation, startRotation, (elapsedTime - duration / 2) / (duration / 2));
            elapsedTime += Time.deltaTime;
            yield return null;
        }
        
        transform.rotation = startRotation;
        isFlipping = false;
    }

    public void SetMatched(bool matched)
    {
        isMatched = matched;
        UpdateVisuals();
    }

    public void ResetCard()
    {
        isFlipped = false;
        isMatched = false;
        UpdateVisuals();
    }
}
```

#### 4.2 CardManager.cs

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CardManager : MonoBehaviour
{
    public GameObject cardPrefab;
    public float spacing = 1.2f;
    public int rows = 4;
    public int columns = 3;

    private List<Card> cards = new List<Card>();
    private List<Card> flippedCards = new List<Card>();
    private GameController gameController;

    void Start()
    {
        gameController = FindObjectOfType<GameController>();
    }

    public void InitializeCards(List<CardData> cardDataList)
    {
        ClearBoard();
        
        // Shuffle card data
        ShuffleCardData(cardDataList);
        
        // Create cards
        for (int i = 0; i < cardDataList.Count; i++)
        {
            int row = i / columns;
            int col = i % columns;
            
            float x = (col - columns / 2f + 0.5f) * spacing;
            float z = (row - rows / 2f + 0.5f) * spacing;
            
            GameObject cardObj = Instantiate(cardPrefab, new Vector3(x, 0, z), Quaternion.identity);
            cardObj.transform.parent = transform;
            
            Card card = cardObj.GetComponent<Card>();
            card.id = cardDataList[i].id;
            card.pairId = cardDataList[i].pairId;
            card.content = cardDataList[i].content;
            card.type = cardDataList[i].type;
            
            // Set material based on card type
            if (cardDataList[i].type == "symbol")
            {
                card.frontMaterial = Resources.Load<Material>("Materials/SymbolCardMaterial");
            }
            else
            {
                card.frontMaterial = Resources.Load<Material>("Materials/MeaningCardMaterial");
            }
            
            cards.Add(card);
        }
    }

    public bool CanFlipCard()
    {
        return flippedCards.Count < 2;
    }

    public void FlipCard(Card card)
    {
        flippedCards.Add(card);
        gameController.IncrementMoves();
        
        if (flippedCards.Count == 2)
        {
            StartCoroutine(CheckForMatch());
        }
    }

    private IEnumerator CheckForMatch()
    {
        yield return new WaitForSeconds(1f);
        
        if (flippedCards[0].pairId == flippedCards[1].pairId)
        {
            // It's a match
            foreach (Card card in flippedCards)
            {
                card.SetMatched(true);
            }
            
            gameController.AddMatchedPair(flippedCards[0].pairId);
            gameController.AddScore(50);
        }
        else
        {
            // Not a match
            foreach (Card card in flippedCards)
            {
                card.isFlipped = false;
                card.UpdateVisuals();
            }
        }
        
        flippedCards.Clear();
    }

    public void ResetCards()
    {
        foreach (Card card in cards)
        {
            card.ResetCard();
        }
        flippedCards.Clear();
    }

    private void ClearBoard()
    {
        foreach (Card card in cards)
        {
            Destroy(card.gameObject);
        }
        
        cards.Clear();
        flippedCards.Clear();
    }

    private void ShuffleCardData(List<CardData> list)
    {
        int n = list.Count;
        for (int i = n - 1; i > 0; i--)
        {
            int j = Random.Range(0, i + 1);
            CardData temp = list[i];
            list[i] = list[j];
            list[j] = temp;
        }
    }
}

[System.Serializable]
public class CardData
{
    public int id;
    public int pairId;
    public string content;
    public string type;
}
```

#### 4.3 GameController.cs

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class GameController : MonoBehaviour
{
    private CardManager cardManager;
    private int currentLevel = 1;
    private int score = 0;
    private int moves = 0;
    private float timer = 0f;
    private bool isGameActive = false;
    private List<int> matchedPairs = new List<int>();
    private int totalPairs = 0;

    private const string UNITY_MESSAGE_OBJECT = "UnityMessageManager";

    void Start()
    {
        cardManager = FindObjectOfType<CardManager>();
        UnityMessageManager.Instance.OnMessage += OnUnityMessage;
    }

    void Update()
    {
        if (isGameActive)
        {
            timer += Time.deltaTime;
            
            // Send timer update every second
            if (Mathf.FloorToInt(timer) > Mathf.FloorToInt(timer - Time.deltaTime))
            {
                SendTimerUpdate();
            }
        }
    }

    public void InitializeGame(string jsonData)
    {
        GameData gameData = JsonUtility.FromJson<GameData>(jsonData);
        currentLevel = gameData.level;
        
        List<CardData> cardDataList = new List<CardData>();
        totalPairs = gameData.pairs.Length;
        
        // Create symbol cards
        for (int i = 0; i < gameData.pairs.Length; i++)
        {
            PairData pair = gameData.pairs[i];
            CardData symbolCard = new CardData
            {
                id = pair.id * 2 - 1,
                pairId = pair.id,
                content = pair.symbol,
                type = "symbol"
            };
            cardDataList.Add(symbolCard);
            
            // Create meaning cards
            CardData meaningCard = new CardData
            {
                id = pair.id * 2,
                pairId = pair.id,
                content = pair.meaning,
                type = "meaning"
            };
            cardDataList.Add(meaningCard);
        }
        
        // Initialize the card manager with our data
        cardManager.InitializeCards(cardDataList);
        
        // Reset game state
        ResetGame();
        
        // Start the game
        isGameActive = true;
    }

    public void ResetGame()
    {
        score = 0;
        moves = 0;
        timer = 0f;
        matchedPairs.Clear();
        isGameActive = false;
        
        cardManager.ResetCards();
        
        // Send initial updates
        SendScoreUpdate();
        SendMovesUpdate();
        SendTimerUpdate();
    }

    public void PauseGame()
    {
        isGameActive = false;
    }

    public void ResumeGame()
    {
        isGameActive = true;
    }

    public void AddMatchedPair(int pairId)
    {
        if (!matchedPairs.Contains(pairId))
        {
            matchedPairs.Add(pairId);
            
            // Check if all pairs are matched
            if (matchedPairs.Count == totalPairs)
            {
                OnLevelComplete();
            }
        }
    }

    public void AddScore(int points)
    {
        score += points;
        SendScoreUpdate();
    }

    public void IncrementMoves()
    {
        moves++;
        SendMovesUpdate();
    }

    private void OnLevelComplete()
    {
        isGameActive = false;
        
        // Calculate bonus points
        float timeBonus = Mathf.Max(0, 300 - timer) * 2;
        float moveBonus = Mathf.Max(0, 200 - moves * 5);
        float levelBonus = currentLevel * 100;
        int totalBonus = Mathf.RoundToInt(timeBonus + moveBonus + levelBonus);
        
        // Add bonus to score
        score += totalBonus;
        SendScoreUpdate();
        
        // Send level complete message
        LevelCompleteData levelData = new LevelCompleteData
        {
            level = currentLevel,
            time = Mathf.RoundToInt(timer),
            moves = moves,
            score = score,
            bonus = totalBonus
        };
        
        string jsonData = JsonUtility.ToJson(levelData);
        SendUnityMessage("OnLevelComplete", jsonData);
    }

    private void SendScoreUpdate()
    {
        SendUnityMessage("OnScoreUpdate", score.ToString());
    }

    private void SendMovesUpdate()
    {
        SendUnityMessage("OnMovesUpdate", moves.ToString());
    }

    private void SendTimerUpdate()
    {
        SendUnityMessage("OnTimerUpdate", Mathf.RoundToInt(timer).ToString());
    }

    private void SendUnityMessage(string name, string data)
    {
        UnityMessageManager.Instance.SendMessageToRN(name, data);
    }

    private void OnUnityMessage(MessageType messageType, string message)
    {
        switch (messageType.ToString())
        {
            case "InitializeGame":
                InitializeGame(message);
                break;
            case "ResetGame":
                ResetGame();
                break;
            case "PauseGame":
                PauseGame();
                break;
            case "ResumeGame":
                ResumeGame();
                break;
            default:
                Debug.Log("Unhandled message type: " + messageType.ToString());
                break;
        }
    }

    void OnDestroy()
    {
        UnityMessageManager.Instance.OnMessage -= OnUnityMessage;
    }
}

[Serializable]
public class GameData
{
    public int level;
    public PairData[] pairs;
}

[Serializable]
public class PairData
{
    public int id;
    public string symbol;
    public string meaning;
}

[Serializable]
public class LevelCompleteData
{
    public int level;
    public int time;
    public int moves;
    public int score;
    public int bonus;
}
```

#### 4.4 UnityMessageManager.cs

```csharp
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public enum MessageType
{
    InitializeGame,
    ResetGame,
    PauseGame,
    ResumeGame
}

[Serializable]
public class MessageEvent : UnityEvent<MessageType, string> { }

public class UnityMessageManager : MonoBehaviour
{
    public static UnityMessageManager Instance { get; private set; }

    public MessageEvent OnMessage = new MessageEvent();

    private Dictionary<string, Action<string>> messageHandlers = new Dictionary<string, Action<string>>();

    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }

    public void SendMessageToRN(string name, string data)
    {
#if UNITY_IOS && !UNITY_EDITOR
        UnityMessageManager_SendMessageToRN(name, data);
#elif UNITY_ANDROID && !UNITY_EDITOR
        using (AndroidJavaClass jc = new AndroidJavaClass("com.reactnative.unity.view.UnityUtils"))
        {
            jc.CallStatic("sendMessageToRN", name, data);
        }
#else
        Debug.Log($"SendMessageToRN: {name}, {data}");
#endif
    }

    public void OnRNMessage(string message)
    {
        try
        {
            JSONObject json = new JSONObject(message);
            string type = json.GetString("type");
            string data = json.GetString("data");
            
            MessageType messageType;
            if (Enum.TryParse(type, out messageType))
            {
                OnMessage.Invoke(messageType, data);
            }
            else
            {
                Debug.LogError($"Unknown message type: {type}");
            }
        }
        catch (Exception e)
        {
            Debug.LogError($"Failed to parse message: {e.Message}");
        }
    }
}

#if UNITY_IOS && !UNITY_EDITOR
[DllImport("__Internal")]
private static extern void UnityMessageManager_SendMessageToRN(string name, string data);
#endif
```

### 5. Export Unity as a Library

#### 5.1 For Android:

1. In Unity, go to **File > Build Settings**
2. Select **Android** as the platform
3. Click **Switch Platform** if needed
4. Check **Export Project**
5. Go to **Player Settings > Other Settings**
6. Set **Scripting Backend** to **IL2CPP**
7. Check **ARM64** in **Target Architectures**
8. Click **Build** and select a folder (e.g., `android-export`)

#### 5.2 For iOS:

1. In Unity, go to **File > Build Settings**
2. Select **iOS** as the platform
3. Click **Switch Platform** if needed
4. Go to **Player Settings > Other Settings**
5. Set **Target Device** to **iPhone and iPad**
6. Click **Build** and select a folder (e.g., `ios-export`)

### 6. Integrate Unity Export into React Native

#### 6.1 For Android:

Follow the react-native-unity-view integration guide for Android:
https://github.com/asmadsen/react-native-unity-view/tree/master#android

#### 6.2 For iOS:

Follow the react-native-unity-view integration guide for iOS:
https://github.com/asmadsen/react-native-unity-view/tree/master#ios

### 7. Update React Native Code

The React Native code in the project has already been updated to work with Unity. Make sure to:

1. Import the UnityView component
2. Set up proper communication between React Native and Unity
3. Handle Unity lifecycle events

## Usage

To interact with the Unity game from React Native:

```javascript
// Send a message to Unity
unityRef.current.postMessage('GameController', 'InitializeGame', JSON.stringify(levelData));

// Handle messages from Unity
const onUnityMessage = (message) => {
  const { name, data } = message;
  
  switch (name) {
    case 'OnLevelComplete':
      // Handle level completion
      break;
    // Handle other message types
  }
};
```

## Troubleshooting

- **Unity view not displaying**: Make sure the Unity export was successful and integrated correctly
- **Communication not working**: Check Unity logs and React Native logs for errors
- **Performance issues**: Optimize Unity scene, reduce polygon count of 3D objects

## Resources

- [React Native Unity View Documentation](https://github.com/asmadsen/react-native-unity-view)
- [Unity Documentation](https://docs.unity3d.com/)
- [Unity Manual: Building for Mobile](https://docs.unity3d.com/Manual/MobileBuildSettings.html) 