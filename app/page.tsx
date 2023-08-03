'use client';

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';

import Footer from '../components/Footer';
import Header from '../components/Header';
import { useChat } from 'ai/react';

export default function Page() {
  const [bio, setBio] = useState('');
  const [isFormSubmitted, setFormSubmitted] = useState(false); // New state to track if the form is being submitted
  
  const bioRef = useRef<null | HTMLDivElement>(null);
  const eventRef = useRef<any>(null); // New ref to store the form submit event
  
  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const { input, handleInputChange, handleSubmit, isLoading, messages } =
      useChat({
        body: {
          bio,
        },
        onResponse() {
          scrollToBios();
        },
      });
  
  const onSubmit = (e: any) => {
    e.preventDefault(); // Prevent the form from submitting normally
    eventRef.current = e; // Store the event
    setBio(input);
    setFormSubmitted(true); // Mark form as submitted
  };
  
  useEffect(() => {
    if (isFormSubmitted) {
      handleSubmit(eventRef.current); // Use the stored event
      setFormSubmitted(false); // Reset form submission state
    }
  }, [bio, isFormSubmitted]); // Run this function whenever bio or isFormSubmitted changes  

  const lastMessage = messages[messages.length - 1];
  const generatedBios = lastMessage?.role === "assistant" ? lastMessage.content : null;

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Generate your own Tony Template™ better than anyone. 
        </h1>
        
        <form className="max-w-xl w-full" onSubmit={onSubmit}>
          <div className="flex mt-10 items-center space-x-3">
            <p className="text-left font-medium">
              Enter the topic you want to brag about:
            </p>
          </div>
          <textarea
            value={input}
            onChange={handleInputChange}
            rows={4}
            maxLength={100}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              'e.g. investing into weed plantations.'
            }
          />
          
          {!isLoading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              type="submit"
            >
              Generate your template &rarr;
            </button>
          )}
          {isLoading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <span className="loading">
                <span style={{ backgroundColor: 'white' }} />
                <span style={{ backgroundColor: 'white' }} />
                <span style={{ backgroundColor: 'white' }} />
              </span>
            </button>
          )}
        </form>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <output className="space-y-10 my-10">
          {generatedBios && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={scrollRef}
                >
                  Your generated template
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                {generatedBios
                  .substring(generatedBios.indexOf('1') + 3)
                  .split('2.')
                  .map((generatedBio) => {
                    return (
                      <div
                        className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedBio);
                          toast('Template copied to clipboard', {
                            icon: '✂️',
                          });
                        }}
                        key={generatedBio}
                      >
                        <p>{generatedBio}</p>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </output>
      </main>
      <Footer />
    </div>
  );
}
