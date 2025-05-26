"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestPreferences = exports.testUsers = exports.createTestUser = void 0;
var firebase_1 = require("./config/firebase");
var auth_1 = require("firebase/auth");
var firestore_1 = require("firebase/firestore");
var firestore_2 = require("firebase/firestore");
var createTestUser = function () { return __awaiter(void 0, void 0, void 0, function () {
    var testUserEmail, testUserPassword, userCredential, userId, userData, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                testUserEmail = 'test@becayis.gov.tr';
                testUserPassword = 'Test123!';
                return [4 /*yield*/, (0, auth_1.createUserWithEmailAndPassword)(firebase_1.auth, testUserEmail, testUserPassword)];
            case 1:
                userCredential = _a.sent();
                userId = userCredential.user.uid;
                userData = {
                    id: userId,
                    name: 'Test Kullanıcı',
                    email: testUserEmail,
                    department: 'Bilgi İşlem',
                    institution: 'Milli Eğitim Bakanlığı',
                    location: {
                        il: 'Ankara',
                        ilce: 'Çankaya'
                    },
                    createdAt: firestore_2.Timestamp.now(),
                    updatedAt: firestore_2.Timestamp.now()
                };
                return [4 /*yield*/, (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_1.db, 'users', userId), userData)];
            case 2:
                _a.sent();
                console.log('Test kullanıcısı başarıyla oluşturuldu:', {
                    email: testUserEmail,
                    password: testUserPassword
                });
                return [2 /*return*/, {
                        email: testUserEmail,
                        password: testUserPassword
                    }];
            case 3:
                error_1 = _a.sent();
                console.error('Test kullanıcısı oluşturulurken hata:', error_1);
                throw error_1;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createTestUser = createTestUser;
exports.testUsers = [
    {
        id: 'user1',
        currentLocation: { city: 'İstanbul', district: 'Kadıköy' },
        desiredLocations: [
            { city: 'Ankara', district: 'Çankaya' },
            { city: 'İzmir', district: 'Konak' },
            { city: 'Bursa', district: 'Nilüfer' }
        ],
        institution: 'Devlet Hastanesi',
        title: 'Doktor',
        institutionCategory: 'Sağlık',
        displayName: 'Dr. Ahmet Yılmaz'
    },
    {
        id: 'user2',
        currentLocation: { city: 'Ankara', district: 'Çankaya' },
        desiredLocations: [
            { city: 'İstanbul', district: 'Kadıköy' },
            { city: 'Antalya', district: 'Muratpaşa' },
            { city: 'Konya', district: 'Selçuklu' }
        ],
        institution: 'Devlet Hastanesi',
        title: 'Doktor',
        institutionCategory: 'Sağlık',
        displayName: 'Dr. Ayşe Demir'
    },
    {
        id: 'user3',
        currentLocation: { city: 'İzmir', district: 'Konak' },
        desiredLocations: [
            { city: 'Ankara', district: 'Çankaya' },
            { city: 'Bursa', district: 'Nilüfer' },
            { city: 'Antalya', district: 'Muratpaşa' }
        ],
        institution: 'Devlet Hastanesi',
        title: 'Doktor',
        institutionCategory: 'Sağlık',
        displayName: 'Dr. Mehmet Kaya'
    }
];
var createTestPreferences = function () {
    return exports.testUsers.map(function (user) { return ({
        userId: user.id,
        currentLocation: user.currentLocation,
        targetLocation: user.desiredLocations[0],
        institutionType: user.institutionCategory,
        title: user.title
    }); });
};
exports.createTestPreferences = createTestPreferences;
